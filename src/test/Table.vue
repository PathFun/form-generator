<script lang="jsx">
import { defineComponent } from 'vue';
import { Alert } from 'ant-design-vue';
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
      const {
        message = '',
        description = '',
        ...rest
      } = componentProps;
      rest.style = { ...(rest.style || {}), width: '100%' };
      return (
        <Alert {...rest}>
          {{
            message: () => 
              message[0] === '<' ? <span innerHTML={message} /> : message,
            description: () => 
              description[0] === '<' ? (
                <span innerHTML={description} />
              ) : (
                description
              )
          }}
        </Alert>
      );
    };
  }
});
</script>
