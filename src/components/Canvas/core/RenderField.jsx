import { defineComponent } from 'vue';
import { getParentProps, isCssLength, isLooselyNumber, transformProps } from '../../../utils';
import { useStore } from '../../../utils/context';
import { getWidgetName } from '../../../utils/mapping';
import list from '../../../widgets/list';
import map from '../../../widgets/map';

const RenderField = defineComponent({
  props: {
    _id: String,
    item: Object,
    labelClass: String,
    contentClass: String,
    isComplex: Boolean
  },
  setup(props, { slots }) {
    const store = useStore();

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

    return () => {
      const { schema, data } = props.item;
      const { flatten, widgets, mapping, frProps = {} } = store;
      const { labelWidth, displayType, showValidate } = frProps;
      const { title, description, required } = schema;

      const _widgets = {
        ...widgets,
        list,
        map
      };
      
      let widgetName = getWidgetName(schema, mapping);
      const customWidget = schema['widget'];
      if (customWidget && _widgets[customWidget]) {
        widgetName = customWidget;
      }

      let Widget = _widgets[widgetName];
      if (!Widget) {
        const defaultSchema = { ...schema };
        delete defaultSchema['widget'];
        widgetName = getWidgetName(defaultSchema, mapping);
        Widget = _widgets[widgetName] || 'input';
      }

      const effectiveLabelWidth = getParentProps('labelWidth', props._id, flatten) || labelWidth;
      const _labelWidth = isLooselyNumber(effectiveLabelWidth)
        ? Number(effectiveLabelWidth)
        : isCssLength(effectiveLabelWidth)
        ? effectiveLabelWidth
        : '110px'; // 默认是 110px 的长度

      let labelStyle = { width: _labelWidth + 'px' };
      if (widgetName === 'checkbox' || props.isComplex || displayType === 'column') {
        labelStyle = { flexGrow: 1 };
      }

      let contentStyle = {};
      if (widgetName === 'checkbox' && displayType === 'row') {
        contentStyle.marginLeft = typeof effectiveLabelWidth === 'string' ? effectiveLabelWidth : `${effectiveLabelWidth}px`;
      }

      // 改为直接使用form-render内部自带组件后不需要再包一层options
      const usefulWidgetProps = transformProps({
        value: data || schema.default,
        checked: data,
        disabled: schema.disabled,
        readOnly: schema.readOnly,
        format: schema.format,
        onChange,
        schema,
        componentProps: schema.props
      });

      const originNode = (
        <>
          {schema.title ? (
            <div class={props.labelClass} style={labelStyle}>
              <label
                class={`fr-label-title ${widgetName === 'checkbox' || displayType === 'column' ? 'no-colon' : ''}`} // checkbox不带冒号
                title={title}
              >
                {required && <span class="fr-label-required"> *</span>}
                <span class={`${props.isComplex ? 'b' : ''} ${displayType === 'column' ? 'flex-none' : ''}`}>
                  <span innerHTML={title} />
                </span>
                {description && <span class="fr-desc ml2">(&nbsp;{description}&nbsp;)</span>}
                {displayType !== 'row' && showValidate && <span class="fr-validate">validation</span>}
              </label>
            </div>
          ) : null}
          <div class={props.contentClass} style={contentStyle}>
            <Widget {...usefulWidgetProps}>{slots.default ? slots.default() : null}</Widget>
          </div>
        </>
      );
      return originNode;
    };
  }
});

export default RenderField;
