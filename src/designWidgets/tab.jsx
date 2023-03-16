import { defineComponent } from 'vue';
import { Tabs, TabPane } from 'ant-design-vue';
import Wrapper from '../components/Canvas/core/Wrapper';
import RenderChildren from '../components/Canvas/core/RenderChildren';
export default defineComponent({
  props: {
    _id: String,
    item: Object,
  },
  setup(props, { slots }) {
    return () => {
      const { item = {}, _id } = props;
      const { schema = {} } = item
      const attrs = schema.props || {};
      const { rows = [] } = schema
      const { title = schema.title, ...rest } = attrs
      rest.style = { ...(attrs.style || {}), width: '100%' }
      const Wrapper = slots.wrapper
      return (
        <Tabs {...rest}>
          {{
            leftExtra: () =>
              typeof title === 'string' && title.startsWith('<') ? (
                <div innerHTML={title} />
              ) : title,
            default: () =>
              rows.map((subItem, rowIdx) => {
                const { widgets = [], ...paneRest } = subItem;
                return (
                  <TabPane {...paneRest} key={rowIdx}>
                    <Wrapper
                        _id={`${_id}|${rowIdx}`}
                        item={item}
                        inside={true}
                        _children={widgets.map(d => `${_id}/${d}`)}
                        >
                      </Wrapper>  
                  </TabPane>
                );
              }),
          }}
        </Tabs>
      );
    };
  },
});
