import { defineComponent } from 'vue';
import { Tabs, TabPane } from 'ant-design-vue';
import Wrapper from '../components/Canvas/core/Wrapper';
import RenderChildren from '../components/Canvas/core/RenderChildren';
export default defineComponent({
  props: {
    _id: String,
    item: Object,
  },
  setup(props) {
    return () => {
      const { item = {} } = props;
      const { schema = {} } = item
      const attrs = schema.props || {};
      const { rows = [] } = schema
      const { title = schema.title, ...rest } = attrs
      rest.style = { ...(attrs.style || {}), width: '100%' }
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
                        _id={`${props._id}|${rowIdx}`}
                        item={props.item}
                        inside>
                        {
                          widgets.length ?
                          <ul class={`flex flex-wrap pl0`}>
                            <RenderChildren _children={widgets.map(d => `${props._id}/${d}`)} />
                          </ul> :
                          <div class="h2" />
                        }
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
