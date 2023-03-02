<script lang="jsx">
import { defineComponent } from 'vue';
import { Divider } from 'ant-design-vue';
export default defineComponent({
  name: 'Divider',
  inheritAttrs: false,
  props: {
    componentProps: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    return () => {
      const { componentProps = {} } = props;
      const { text = '', ...rest } = componentProps;
      rest.style = { ...(rest.style || {}), width: '100%' };
      return <Divider {...rest}>{{ default: text[0] === '<' ? <span innerHTML={text} /> : text }}</Divider>;
    };
  }
});
</script>
