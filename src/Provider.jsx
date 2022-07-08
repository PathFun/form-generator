import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/lib/locale/zh_CN';
import copyTOClipboard from 'copy-text-to-clipboard';
import { defineComponent, reactive, watch, ref, computed } from 'vue';
import { defaultMapping, defaultWidgets } from 'form-render-vue3';
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
import list from './widgets/list';

const DEFAULT_SCHEMA = {
  type: 'object',
  properties: {}
};

const Provider = defineComponent({
  name: 'Provider',
  props: {
    defaultValue: Object,
    canDrag: Boolean,
    canDelete: Boolean,
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
    settings: Object,
    commonSettings: Object,
    globalSettings: Object,
    widgets: {
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
      frProps: {}, // form-render 的全局 props 等
      isNewVersion: true, // 用schema字段，还是用propsSchema字段，这是一个问题
      preview: false, // preview = false 是编辑模式
      schema: {},
      selected: undefined, // 被选中的$id, 如果object/array的内部，以首字母0标识
      settingsForm: null
    });

    const _transformer = {
      from: schema => schema,
      to: schema => schema,
      fromSetting,
      toSetting,
      ...props.transformer
    };

    const errorFields = ref([]);

    // 收口点 propsSchema 到 schema 的转换 (一共3处，其他两个是 importSchema 和 setValue，在 FRWrapper 文件)
    watch(
      () => props.defaultValue,
      newValue => {
        const schema = newValue ? _transformer.from(newValue) : DEFAULT_SCHEMA;
        if (schema) Object.assign(state, { ...schemaToState(schema) });
      }
    );

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

    const _schema = computed(() => {
      let displaySchema = {};
      let displaySchemaString = '';
      try {
        const _schema = {
          ...idToSchema(flattenWithData, '#', true),
          ...state.frProps
        };
        displaySchema = _transformer.to(_schema);
        displaySchemaString = JSON.stringify(displaySchema, null, 2);
      } catch (error) {
        console.log(error);
      }
      return {
        displaySchema,
        displaySchemaString
      };
    });

    const flatten = reactive({});
    const flattenWithData = reactive({});

    watch([() => state.schema, () => state.formData], (newValue, newFormData) => {
      let _schema = {};
      if (state.schema) {
        _schema = combineSchema(newValue);
      }
      Object.assign(flatten, { ...flattenSchema(_schema) });
      Object.assign(flattenWithData, {
        ..._transformer.from(dataToFlatten(flatten, newFormData))
      });
    });

    const onFlattenChange = (newFlatten, changeSource = 'schema') => {
      const newSchema = idToSchema(newFlatten);
      const newData = flattenToData(newFlatten);
      // 判断只有schema变化时才调用，一般需求的用户不需要
      if (changeSource === 'schema') {
        onSchemaChange(newSchema);
      }
      // schema 变化大都会触发 data 变化
      onChange(newData);
    };

    const onItemChange = (key, value, changeSource) => {
      Object.assign(flattenWithData, { [key]: value });
      onFlattenChange(flattenWithData, changeSource);
    };

    const onSubmit = value => {
      emit('submit', value);
    };

    const getValue = () => _schema.value.displaySchema;

    const setValue = value => {
      try {
        Object.assign(state, {
          ...state,
          selected: undefined,
          ...schemaToState(_transformer.from(value))
        });
      } catch (error) {
        console.error(error);
      }
    };

    const copyValue = () => {
      copyTOClipboard(_schema.value.displaySchemaString);
    };

    const getErrorFields = () => errorFields.value;

    const setErrorFields = newErrorFields => (errorFields.value = newErrorFields);

    const getSettingsForm = () => state.settingsForm;

    const initStore = () => {
      const {
        mapping,
        widgets,
        canDrag,
        canDelete,
        transformer,
        extraButtons,
        controlButtons,
        hideId,
        getId,
        validation,
        settings,
        commonSettings,
        globalSettings
      } = props;
      const _mapping = { ...defaultMapping, ...mapping };
      const _widgets = { ...defaultWidgets, ...widgets, list };

      const userProps = {
        canDrag,
        canDelete,
        submit: onSubmit,
        transformer,
        extraButtons,
        controlButtons,
        hideId,
        getId,
        validation,
        settings,
        commonSettings,
        globalSettings
      };

      const { displaySchema, displaySchemaString } = _schema.value;

      // TODO: flatten是频繁在变的，应该和其他两个函数分开
      const store = reactive({
        flatten: flattenWithData, // schema + formData = flattenWithData
        onFlattenChange, // onChange + onSchemaChange = onFlattenChange
        onItemChange, // onFlattenChange 里只改一个item的flatten，使用这个方法
        onSchemaChange,
        onChange,
        errorFields,
        onItemErrorChange: setErrorFields,
        userProps,
        frProps: state.frProps,
        displaySchema,
        displaySchemaString,
        fieldRender: slots.fieldRender,
        fieldWrapperRender: slots.fieldWrapperRender,
        elementRender: slots.elementRender,
        preview: props.preview,
        mapping: _mapping,
        widgets: _widgets,
        selected: props.selected
      });

      Ctx(value => Object.assign(state, value));
      StoreCtx(store);
    };

    expose({
      getValue,
      setValue,
      copyValue,
      getErrorFields,
      getSettingsForm
    });

    initStore();

    return () => {
      return (
        <DndProvider backend={HTML5Backend} context={window}>
          <ConfigProvider locale={zhCN}>{slots.default ? slots.default() : null}</ConfigProvider>
        </DndProvider>
      );
    };
  }
});

export default Provider;
