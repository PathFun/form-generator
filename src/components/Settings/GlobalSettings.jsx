import FormRender, { useForm } from 'form-render-vue3';
import { defineComponent, onMounted, ref, watch } from 'vue';
import { defaultGlobalSettings } from '../../settings';
import { useGlobal, useStore } from '../../utils/context';

const GlobalSettings = defineComponent({
  props: {
    widgets: Object
  },
  setup(props) {
    const form = useForm({
      removeHiddenData: false,
      formData: {}
    });
    const innerUpdate = ref(false);
    const store = useStore();
    const setGlobal = useGlobal();
    const globalSettings = store.userProps?.globalSettings || defaultGlobalSettings;

    const onDataChange = value => {
      innerUpdate.value = !!Object.keys(value).length;
      setGlobal({ frProps: value });
    };

    watch(
      () => store.frProps,
      newValue => {
        if (innerUpdate) {
          innerUpdate.value = false;
        } else {
          form.setValues(newValue);
        }
      }
    );

    onMounted(() => {
      setGlobal({ settingsForm: form });
    });

    return () => {
      const { widgets: globalWidgets, frProps, userProps = {}, mapping } = store;
      return (
        <div>
          <FormRender
            form={form}
            schema={globalSettings}
            watchMap={{
              '#': {
                handler: v => onDataChange(v),
                immediate: true
              }
            }}
            widgets={{ ...globalWidgets, ...props.widgets }}
            mapping={mapping}
          />
        </div>
      );
    };
  }
});

export default GlobalSettings;
