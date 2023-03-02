import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/lib/locale/zh_CN';
import copyTOClipboard from 'copy-text-to-clipboard';
import { defineComponent, reactive, watch } from 'vue';
import { defaultMapping, defaultWidget } from 'form-render-vue3';
import { DndProvider } from 'vue3-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { fromSetting, toSetting } from './transformer/form-render';
import {
  combineSchema,
  dataToFlatten,
  defaultGetId,
  flattenSchema,
  flattenToData,
  idToSchema,
  schemaToState
} from './utils';
import { Ctx, StoreCtx } from './utils/context';
const DEFAULT_SCHEMA = {
  type: 'object',
  properties: {}
};

const Provider = defineComponent({
  name: 'Provider',
  props: {
    schema: Object,
    canDrag: {
      type: [Boolean, Function],
      default: true
    },
    canDelete: {
      type: [Boolean, Function],
      default: true
    },
    transformer: Object,
    extraButtons: Array,
    controlButtons: Array,
    hideId: {
      type: Boolean,
      default: false
    },
    getId: {
      type: Function,
      default: defaultGetId
    },
    settings: Array,
    commonSettings: Object,
    globalSettings: Object,
    widgets: {
      type: Object,
      default: () => ({})
    },
    designWidgets: {
      type: Object,
      default: () => ({})
    },
    mapping: {
      type: Object,
      default: () => ({})
    },
    validation: {
      type: Boolean,
      default: true
    }
  },
  components: {
    ConfigProvider,
    DndProvider
  },
  emits: ['schemaChange', 'change', 'submit'],
  setup(props, { expose, slots, emit }) {
    const state = reactive({
      formData: {},
      schema: {},
      frProps: {},
      preview: false,
      selected: undefined,
      settingsForm: null
    });

    const onChange = data => {
      Object.assign(state, { formData: data });
      emit('change', data);
    };

    const onSchemaChange = newSchema => {
      Object.assign(state, { schema: newSchema });
      setTimeout(() => {
        emit('schemaChange', getValue());
      }, 0);
    };

    const changeDisplaySchema = () => {
      const newSchema = state.schema;
      const newFormData = state.formData;
      let _schema = {};
      if (newSchema) {
        _schema = combineSchema(newSchema);
      }
      const flatten = { ...flattenSchema(_schema) };
      const flattenWithData = {
        ..._transformer.from(dataToFlatten(flatten, newFormData))
      };

      let displaySchema = {};
      let displaySchemaString = '';
      try {
        const schema = {
          ...idToSchema(flattenWithData, '#', true),
          // ...state.frProps
        };
        displaySchema = _transformer.to(schema);
        displaySchemaString = JSON.stringify(displaySchema, null, 2);
      } catch (error) {
        console.log(error);
      }
      Object.assign(store, {
        flatten: flattenWithData,
        displaySchema,
        displaySchemaString
      });
    };

    const onFlattenChange = (newFlatten, changeSource) => {
      const newSchema = idToSchema(newFlatten);
      const newData = flattenToData(newFlatten);
      omSchemaAndDataChange(newSchema, newData, changeSource)
    };

    const omSchemaAndDataChange = (newSchema, newData, changeSource = 'schema') => {
      // 判断只有schema变化时才调用，一般需求的用户不需要
      if (changeSource === 'schema') {
        onSchemaChange(newSchema);
      }
      // schema 变化大都会触发 data 变化
      onChange(newData);
      changeDisplaySchema();
    };

    const onItemChange = (key, value, changeSource) => {
      const newFlattenWithData = { ...store.flatten, [key]: value };
      Object.assign(store, {
        flatten: newFlattenWithData
      });
      onFlattenChange(newFlattenWithData, changeSource);
    };

    const getValue = () => store.displaySchema;

    const setValue = value => {
      try {
        Object.assign(state, {
          ...state,
          selected: undefined,
          ...schemaToState(_transformer.from(value))
        });
        Object.assign(store, {
          frProps: state.frProps,
          preview: state.preview,
          selected: state.selected
        });
      } catch (error) {
        console.error(error);
      }
    };

    const copyValue = () => {
      copyTOClipboard(store.displaySchemaString);
    };

    const getErrorFields = () => store.errorFields;

    const setErrorFields = newErrorFields =>
      Object.assign(store, { errorFields: newErrorFields });

    const getSettingsForm = () => state.settingsForm;

    const _transformer = {
      from: schema => schema,
      to: schema => schema,
      fromSetting,
      toSetting,
      ...props.transformer
    };

    const userProps = {
      canDrag: props.canDrag,
      canDelete: props.canDelete,
      submit: emit('submit'),
      transformer: _transformer,
      extraButtons: props.extraButtons,
      controlButtons: props.controlButtons,
      hideId: props.hideId,
      getId: props.getId,
      validation: props.validation,
      settings: props.settings,
      commonSettings: props.commonSettings,
      globalSettings: props.globalSettings
    };

    const store = reactive({
      flatten: {}, // schema + formData = flattenWithData
      onFlattenChange, // onChange + onSchemaChange = onFlattenChange
      onItemChange, // onFlattenChange 里只改一个item的flatten，使用这个方法
      onSchemaChange,
      omSchemaAndDataChange,
      onChange,
      errorFields: [],
      onItemErrorChange: setErrorFields,
      userProps,
      frProps: {},
      displaySchema: {},
      displaySchemaString: '',
      preview: false,
      mapping: { ...defaultMapping, ...props.mapping },
      widgets: { ...defaultWidget, ...props.widgets },
      designWidgets: { ...props.designWidgets },
      selected: undefined
    });

    Ctx(value => Object.assign(store, { ...value }));

    StoreCtx(store);

    watch(
      () => props.schema,
      newSchema => {
        const _schema = newSchema
          ? _transformer.from(newSchema)
          : DEFAULT_SCHEMA;
        if (_schema) {
          const newState = schemaToState(_schema);
          Object.assign(state, newState);
          Object.assign(store, { frProps: newState.frProps });
          changeDisplaySchema();
        }
      },
      {
        immediate: true,
        deep: true
      }
    );

    changeDisplaySchema();

    watch(
      [() => state.selected, () => state.preview],
      ([selected, preview]) => {
        Object.assign(store, {
          selected,
          preview
        });
      }
    );

    expose({
      getValue,
      setValue,
      copyValue,
      getErrorFields,
      getSettingsForm
    });

    return () => {
      return (
        <DndProvider backend={HTML5Backend} context={window}>
          <ConfigProvider locale={zhCN}>
            {slots.default ? slots.default() : null}
          </ConfigProvider>
        </DndProvider>
      );
    };
  }
});

export default Provider;
