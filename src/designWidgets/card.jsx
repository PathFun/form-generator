import { defineComponent } from 'vue';
// import Wrapper from '../components/Canvas/core/Wrapper';
// import RenderChildren from '../components/Canvas/core/RenderChildren';
import { Card } from 'ant-design-vue';

const LayoutCard = defineComponent({
  props: {
    _id: String,
    item: Object,
    contentClass: String,
  },
  setup(props, { slots }) {
    return () => {
      const { item = {} } = props;
      const { schema = {} } = item
      const attrs = schema.props || {};
      const { extra = '', cover = '', ...rest } = attrs;
      rest.title = rest.title ? rest.title : schema.title;
      const Wrapper = slots.wrapper
      return (
        <>
          <div class={props.contentClass}>
            <Card {...rest}>
              {{
                extra: () => {
                  return typeof extra === 'string' && extra[0] === '<' ? (
                    <span innerHTML={extra}></span>
                  ) : (
                    extra
                  );
                },
                cover: () => {
                  return typeof cover === 'string' && cover[0] === '<' ? (
                    <div innerHTML={cover}></div>
                  ) : (
                    cover
                  );
                },
                default: () => (
                  <Wrapper
                    _id={`${props._id}`}
                    item={props.item}
                    inside={true}
                    _children={item.children || []}
                  />
                )
              }}
            </Card>
          </div>
        </>
      );
    };
  }
});

export default LayoutCard;
