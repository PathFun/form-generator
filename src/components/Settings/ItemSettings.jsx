import FormRender, { useForm } from 'form-render-vue3';
import { defineComponent, watch, onMounted, ref, computed } from 'vue';
import {
  advancedElements,
  baseCommonSettings,
  defaultCommonSettings,
  defaultSettings,
  elements,
  layouts
} from '../../settings';
import { isObject, mergeInOrder } from '../../utils';
import { useGlobal, useStore } from '../../utils/context';
import { getWidgetName } from '../../utils/mapping';
import * as frgWidgets from '../../widgets';

const ItemSettings = defineComponent({
  props: {
    widgets: Object
  },
  setup(props) {
    const setGlobal = useGlobal();
    const form = useForm();
    const store = useStore();
    const { settings, commonSettings, hideId, validation, transformer } = store.userProps;
    const settingSchema = ref({});

    const _widgets = {
      ...store.widgets,
      ...frgWidgets
    };

    const getWidgetList = (settings, commonSettings) => {
      return settings.reduce((widgetList, setting) => {
        if (!Array.isArray(setting.widgets)) return widgetList;
        const basicWidgets = setting.widgets.map(item => {
          const baseItemSettings = {};
          if (item.schema.type === 'array' && item.schema.items) {
            baseItemSettings.items = {
              type: 'object',
              hidden: '{{true}}'
            };
          }
          return {
            ...item,
            widget: item.widget || item.schema.widget || getWidgetName(item.schema, store.mapping),
            setting: mergeInOrder(baseCommonSettings, commonSettings, baseItemSettings, item.setting)
          };
        });
        return [...widgetList, ...basicWidgets];
      }, []);
    };

    const onDataChange = value => {
      const { selected, flatten, onItemChange } = store;
      try {
        const item = flatten[selected];
        if (!item || selected === '#') return;
        if (item && item.schema) {
          onItemChange(
            selected,
            {
              ...item,
              schema: transformer.fromSetting(value)
            },
            'schema'
          );
        }
      } catch (error) {
        console.error(error, 'catch');
      }
    };

    const widgetList = computed(() => {
      const _settings = Array.isArray(settings)
        ? [...settings, { widgets: [...elements, ...advancedElements, ...layouts] }] // TODO: 不是最优解
        : defaultSettings;
      const _commonSettings = isObject(commonSettings) ? commonSettings : defaultCommonSettings;
      return getWidgetList(_settings, _commonSettings);
    });

    watch(
      () => store.selected,
      newValue => {
        const { flatten, mapping } = store;
        // setting 该显示什么的计算，要把选中组件的 schema 和它对应的 widgets 的整体 schema 进行拼接
        try {
          const item = flatten[newValue];
          if (!item || newValue === '#') return;
          // 算 widgetList
          const widgetName = getWidgetName(item.schema, mapping);
          const element = widgetList.value.find(e => e.widget === widgetName) || {}; // 有可能会没有找到
          const properties = { ...element.setting };
          if (hideId) delete properties._id;
          settingSchema.value = {
            type: 'object',
            displayType: 'column',
            properties
          };
          const value = transformer.toSetting(item.schema);
          setTimeout(() => {
            form.setValues(value);
            onDataChange(form.getValues());
            validation && form.submit();
          }, 0);
        } catch (error) {
          console.error(error);
        }
      },
      {
        immediate: true
      }
    );

    watch([validation, form?.errorFields], ([newValidation, newErrorFields]) => {
      newValidation && store.onItemErrorChange(newErrorFields);
    });

    onMounted(() => {
      setGlobal({ settingsForm: form });
    });

    return () => {
      return (
        <div style={{ paddingRight: 24 }}>
          <FormRender
            form={form}
            schema={settingSchema.value}
            widgets={{ ..._widgets, ...props.widgets }}
            mapping={store.mapping}
            watchMap={{
              '#': v => onDataChange(v)
            }}
          />
        </div>
      );
    };
  }
});

export default ItemSettings;
