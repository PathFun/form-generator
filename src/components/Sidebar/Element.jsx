import { defineComponent, unref, computed } from 'vue';
import { useDrag } from 'vue3-dnd';
import { addItem } from '../../utils';
import { useGlobal, useStore } from '../../utils/context';
import './Element.less';

const Element = defineComponent({
  props: ['text', 'name', 'schema', 'icon', 'fixedName'],
  setup(props) {
    const setGlobal = useGlobal();
    const store = useStore();
    const { getId } = store.userProps;

    const [collect, dragRef] = useDrag({
      type: 'box',
      item: {
        dragItem: {
          parent: '#',
          schema: props.schema,
          children: []
        },
        _id: props.fixedName ? `#/${props.name}` : `#/${getId(props.name)}`
      },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    });

    const isDragging = computed(() => unref(collect).isDragging);

    const handleElementClick = async () => {
      const { selected, flatten, errorFields, onFlattenChange } = store;
      if (errorFields?.length) return;
      if (selected && !flatten[selected]) {
        setGlobal({ selected: '#' });
        return;
      }
      const { newId, newFlatten } = addItem({
        selected,
        name: props.name,
        schema: props.schema,
        flatten,
        fixedName: props.fixedName,
        getId
      });
      onFlattenChange(newFlatten);
      setGlobal({ selected: newId });
    };
    const setDrop = el => {
      dragRef(el);
    };

    return () => {
      const { elementRender } = store;
      const widgetProps = {
        text: props.text,
        icon: props.icon,
        onClick: handleElementClick
      };

      const originNode = <WidgetUI {...widgetProps} />;
      return (
        <div ref={setDrop}>{elementRender ? elementRender(props.schema, widgetProps, originNode) : originNode}</div>
      );
    };
  }
});

export default Element;

// 目前没有用icon，但是可以补上
const WidgetUI = ({ onClick, text, icon }) => {
  return (
    <li className="left-item" onClick={onClick}>
      {icon}
      {text}
    </li>
  );
};
