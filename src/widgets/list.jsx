import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';

export default function list(props, { slots }) {
  if (!/^#/.test(props.schema._id)) {
    return <div class="w-100">{slots.default ? slots.default() : null}</div>;
  }

  return (
    <div class="flex flex-column">
      <div class="fr-set w-100 flex flex-column ba pt4 pb2 ph2 relative b--black-10">
        {slots.default ? slots.default() : null}
        <Button size="small" class="self-end" type="dashed" icon={<DeleteOutlined />}>
          删除
        </Button>
      </div>
      <Button size="small" class="self-end" icon={<PlusCircleOutlined />}>
        添加
      </Button>
    </div>
  );
}
