import { CopyOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons-vue';
import { ref, defineComponent } from 'vue';
import { useDrag, useDrop } from 'vue3-dnd';
import { copyItem, dropItem, getKeyFromUniqueId, isObject } from '../../../utils';
import { useGlobal, useStore } from '../../../utils/context';
import './Wrapper.less';

const Wrapper = defineComponent({
  props: ['_id', 'item', 'inside', 'style'],
  setup(props, { slots }) {
    const position = ref();
    const { flatten, onFlattenChange, selected, userProps, errorFields, fieldWrapperRender } = useStore();
    const { controlButtons, canDrag = true, canDelete = true, hideId, getId } = userProps;
    const setGlobal = useGlobal();
    const boxRef = ref();
    const [{ isDragging }, dragRef, dragPreview] = useDrag({
      type: 'box',
      item: { _id: props.inside ? 0 + props._id : props._id },
      canDrag: () => (typeof canDrag === 'function' ? canDrag(props.item.schema) : canDrag),
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    });

    const [{ canDrop, isOver }, dropRef] = useDrop({
      accept: 'box',
      drop: async (item, monitor) => {
        // 如果 children 已经作为了 drop target，不处理
        const didDrop = monitor.didDrop();

        if (didDrop || errorFields?.length) {
          return;
        }

        const [newFlatten, newId] = dropItem({
          dragId: item._id, // 内部拖拽用dragId
          dragItem: item.dragItem, // 从左边栏过来的，用dragItem
          dropId: props._id,
          position: position.value,
          flatten
        });
        onFlattenChange(newFlatten);
        setGlobal({ selected: newId });
      },
      hover: (item, monitor) => {
        // 只检查被hover的最小元素
        const didHover = monitor.isOver({ shallow: true });
        if (didHover) {
          // Determine rectangle on screen
          const hoverBoundingRect = boxRef.value && boxRef.value.getBoundingClientRect();
          // Get vertical middle
          const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
          // Determine mouse position
          // const clientOffset = monitor.getClientOffset();
          const dragOffset = monitor.getSourceClientOffset();
          // Get pixels to the top
          const hoverClientY = dragOffset.y - hoverBoundingRect.top;
          // Only perform the move when the mouse has crossed half of the items height
          // When dragging downwards, only move when the cursor is below 50%
          // When dragging upwards, only move when the cursor is above 50%
          // Dragging downwards
          if (props.inside) {
            position.value = 'inside';
          } else {
            if (hoverClientY <= hoverMiddleY) {
              position.value = 'up';
            }
            // Dragging upwards
            if (hoverClientY > hoverMiddleY) {
              position.value = 'down';
            }
          }
        }
      },
      collect: monitor => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop()
      })
    });

    const handleClick = async e => {
      e.stopPropagation();
      if (errorFields?.length) return;
      const _id = props.inside ? '0' + props._id : props._id;
      setGlobal({ selected: _id });
    };

    const deleteItem = async e => {
      e.stopPropagation();
      const newFlatten = { ...flatten };
      let newSelect = '#';
      // 计算删除后新被选中的元素：
      // 1. 如果是第一个，选第二个
      // 2. 如果不是第一，选它前一个
      // 3. 如果同级元素没了，选parent
      try {
        const parent = newFlatten[props._id].parent;
        const siblings = newFlatten[parent].children;
        const idx = siblings.indexOf(props._id);
        if (idx > 0) {
          newSelect = siblings[idx - 1];
        } else {
          newSelect = siblings[1] || parent;
        }
      } catch (error) {
        console.error(error, 'catch');
      }
      let _canDelete = canDelete;
      if (typeof canDelete === 'function') {
        _canDelete = await Promise.resolve(canDelete(newFlatten[props._id].schema));
      }
      if (!_canDelete) return;
      delete newFlatten[props._id];
      onFlattenChange(newFlatten);
      setGlobal({ selected: newSelect });
    };

    const handleItemCopy = e => {
      e.stopPropagation();
      if (errorFields?.length) return;
      const [newFlatten, newId] = copyItem(flatten, props._id, getId);
      onFlattenChange(newFlatten);
      setGlobal({ selected: newId });
    };

    return () => {
      const { schema } = props.item;
      const { type } = schema;

      const isActive = canDrop && isOver;
      dragPreview(dropRef(boxRef));

      // 一些computed
      let isSelected = selected === props._id && !props.inside;
      if (selected && selected[0] === '0') {
        isSelected = selected.substring(1) === props._id && props.inside;
      }

      let overwriteStyle = {
        backgroundColor: '#fff',
        opacity: isDragging ? 0 : 1
      };
      if (props.inside) {
        overwriteStyle = {
          ...overwriteStyle,
          borderColor: '#777',
          // marginLeft: 12,
          padding: '12px 12px 0',
          backgroundColor: '#f6f5f6'
        };
      } else if (props._id === '#') {
        overwriteStyle = {
          ...overwriteStyle,
          borderColor: '#777',
          padding: 12,
          height: '100%',
          overflow: 'auto',
          backgroundColor: '#f6f5f6'
        };
      } else if (type === 'object') {
        overwriteStyle = { ...overwriteStyle, paddingTop: 12 };
      }
      if (isActive) {
        if (props.inside) {
          overwriteStyle = {
            ...overwriteStyle,
            boxShadow: '0 -3px 0 red'
          };
        } else if (position === 'up') {
          overwriteStyle = {
            ...overwriteStyle,
            boxShadow: '0 -3px 0 red'
          };
        } else if (position === 'down') {
          overwriteStyle = {
            ...overwriteStyle,
            boxShadow: '0 3px 0 red'
          };
        }
      }
      if (isSelected) {
        overwriteStyle = {
          ...overwriteStyle,
          outline: '2px solid #409eff',
          borderColor: '#fff',
          zIndex: 1
        };
      }
      if (props.style && typeof style === 'object') {
        overwriteStyle = {
          ...overwriteStyle,
          ...props.style
        };
      }

      if (props._id === '#' && props.inside) return slots.default?.();

      // 展示的id
      const shownId = getKeyFromUniqueId(schema._id);

      // 操作按钮
      const _controlButtons = Array.isArray(controlButtons) ? controlButtons : [true, true];
      const _showDefaultBtns = _controlButtons
        .filter(item => ['boolean', 'function'].includes(typeof item))
        .map(item => {
          if (typeof item === 'boolean') return item;
          return item(schema);
        });
      const _extraBtns = _controlButtons.filter(item => isObject(item) && (item.text || item.children));
      const { length: _numOfBtns } = _showDefaultBtns.concat(_extraBtns).filter(Boolean);

      const hasDuplicateId =
        Object.keys(flatten)
          .map(key => flatten[key].schema._id)
          .filter(key => key === schema._id).length > 1;

      const originNode = (
        <div
          ref={boxRef}
          style={overwriteStyle}
          class={`field-wrapper ${props._id !== '#' && isSelected ? 'selected-field-wrapper' : ''} relative w-100`}
          onClick={handleClick}
        >
          {slots.default ? slots.default() : null}

          <div class="absolute top-0 right-1 f7">
            {!props.inside && props._id !== '#' && !hideId && (
              <span class={hasDuplicateId ? 'red' : 'blue'}>{shownId}</span>
            )}
            {schema.hidden && <span style={{ color: '#666', marginLeft: '6px' }}>[hidden]</span>}
          </div>

          {!props.inside && props._id !== '#' && isSelected && (
            <div class="pointer-move" ref={dragRef}>
              <DragOutlined />
            </div>
          )}

          {!props.inside && props._id !== '#' && isSelected && _numOfBtns > 0 && (
            <div class="pointer-wrapper">
              {_showDefaultBtns[0] !== false && (
                <div class="pointer" onClick={deleteItem}>
                  <DeleteOutlined />
                </div>
              )}
              {_showDefaultBtns[1] !== false && (
                <div class="pointer" onClick={handleItemCopy}>
                  <CopyOutlined />
                </div>
              )}
              {_extraBtns.map((item, idx) => {
                return (
                  <div key={idx.toString()} class="pointer" onClick={e => item.onClick && item.onClick(e, schema)}>
                    {item.text || item.children}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );

      if (!fieldWrapperRender) return originNode;
      return fieldWrapperRender(schema, isSelected, slots.default ? slots.default() : null, originNode);
    };
  }
});

export default Wrapper;
