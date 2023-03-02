import { defineComponent } from 'vue';
import { getWidgetName } from '../../../utils/mapping';
import { useStore } from '../../../utils/context';
import { transformProps } from '../../../utils/'

const RenderLayout = defineComponent({
  props: {
    _id: String,
    item: Object,
    labelClass: String,
    contentClass: String,
    isComplex: Boolean
  },
  setup(props) {
    const store = useStore();
    return () => {
      const { schema, data } = props.item;
      const { designWidgets = {}, mapping, widgets } = store;
      let widgetName = getWidgetName(schema, mapping);
      let Widget = designWidgets[widgetName] || widgets[widgetName];

      const onChange = value => {
        const { item, _id } = props;
        const newItem = { ...item };
        if (item.schema.type === 'boolean' && item.schema.widget === 'checkbox') {
          newItem.data = !value;
        } else {
          newItem.data = value;
        }
        store.onItemChange(_id, newItem, 'data');
      };

      const usefulWidgetProps = transformProps({
        value: data || schema.default,
        checked: data,
        disabled: schema.disabled,
        readOnly: schema.readOnly,
        format: schema.format,
        onChange,
        schema,
        item: props.item,
        _id: props._id,
        contentClass: props.contentClass,
        componentProps: schema.props,
        isDesigning: true
      });
      return Widget ? <Widget {...usefulWidgetProps} /> : <div>notFound design widget</div>;
    };
  }
});

export default RenderLayout;
