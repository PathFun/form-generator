import FormRender, { useForm } from 'form-render-vue3';
import { defineComponent, onMounted, ref, watch } from 'vue';
import { defaultGlobalSettings } from '../../settings';
import { useGlobal, useStore } from '../../utils/context';

const GlobalSettings = defineComponent({
  props: {
    widgets: Object
  },
  setup(props) {
    const form = useForm();
    const innerUpdate = ref(false);
    const { widgets: globalWidgets, frProps, userProps = {}, mapping } = useStore();
    const setGlobal = useGlobal();
    const globalSettings = userProps.globalSettings || defaultGlobalSettings;

    const onDataChange = value => {
      innerUpdate.value = !!Object.keys(value).length;
      setGlobal({ frProps: value });
    };

    watch(frProps, newValue => {
      if (innerUpdate) {
        innerUpdate.value = false;
      } else {
        form.setValues(newValue);
      }
    });

    onMounted(() => {
      setGlobal({ settingsForm: form });
    });

    return () => {
      return (
        <div style={{ paddingRight: 24 }}>
          <FormRender
            form={form}
            schema={globalSettings}
            watch={{
              '#': v => onDataChange(v)
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
