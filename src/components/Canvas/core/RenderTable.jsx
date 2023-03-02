import { defineComponent } from 'vue';
import { useStore } from '../../../utils/context';
import Wrapper from './Wrapper';
import RenderChildren from './RenderChildren';
import { getParentProps, isCssLength, isLooselyNumber } from '../../../utils';
import {
  insertCol,
  insertRow,
  mergeCol,
  mergeRow,
  mergeIntoOneCol,
  mergeIntoOneRow,
  deleteOneCol,
  deleteOneRow,
  undoMerge
} from '../../../utils/table';
import { AppstoreOutlined } from '@ant-design/icons-vue';
import { Dropdown, Menu, MenuItem, MenuDivider } from 'ant-design-vue';
import './RenderTable.less';

const widgetBtns = (store, schema, _id, rowIdx, colIdx) => {
  const newFlatten = { ...store.flatten };
  const rows = newFlatten[_id].schema.rows;
  const colOption = rows[rowIdx][colIdx];
  const dropdownClick = e => e.stopPropagation();

  const handleMenuClick = (rowIdx, colIdx, key) => {
    switch (key) {
      case 'insertLeftCol':
        insertCol(rows, rowIdx, colIdx, 'left');
        break;
      case 'insertRightCol':
        insertCol(rows, rowIdx, colIdx, 'right');
        break;
      case 'insertUpRow':
        insertRow(rows, rowIdx, colIdx, 'up');
        break;
      case 'insertDownRow':
        insertRow(rows, rowIdx, colIdx, 'down');
        break;
      case 'mergeLeftCol':
        mergeCol(rows, rowIdx, colIdx, 'left');
        break;
      case 'mergeRightCol':
        mergeCol(rows, rowIdx, colIdx, 'right');
        break;
      case 'mergeWholeRow':
        mergeIntoOneRow(rows, rowIdx);
        break;
      case 'mergeUpRow':
        mergeRow(rows, rowIdx, colIdx, 'up');
        break;
      case 'mergeDownRow':
        mergeRow(rows, rowIdx, colIdx, 'down');
        break;
      case 'mergeWholeCol':
        mergeIntoOneCol(rows, colIdx);
        break;
      case 'undoMergeRow':
      case 'undoMergeCol':
        undoMerge(rows, rowIdx, colIdx);
        break;
      case 'deleteWholeRow':
        deleteOneRow(rows, rowIdx);
        break;
      case 'deleteWholeCol':
        deleteOneCol(rows, colIdx);
        break;
      default:
        console.warn('not such key');
    }
    store.onFlattenChange(newFlatten);
  };

  const mergeRightColDisabled = (() => {
    let rightColIndex = colIdx + colOption.colspan;
    return (
      colIdx >= rows[rowIdx].length - 1 ||
      rightColIndex > rows[rowIdx].length - 1 ||
      rows[rowIdx][rightColIndex].rowspan !== colOption.rowspan
    );
  })();

  const mergeBelowRowDisabled = (() => {
    let belowRowIndex = rowIdx + colOption.rowspan;
    return (
      rowIdx >= rows.length - 1 ||
      belowRowIndex > rows.length - 1 ||
      rows[belowRowIndex][colIdx].colspan !== colOption.colspan
    );
  })();

  return (
    <>
      <div class="wrapper-title">
        <span>单元格</span>
      </div>
      <div class="pointer-wrapper">
        {(() => {
          switch (schema.widget) {
            case 'table':
              return (
                <div class="pointer">
                  <Dropdown
                    trigger="click"
                    v-slots={{
                      default: () => (
                        <a class="ant-dropdown-link" onClick={dropdownClick}>
                          <AppstoreOutlined />
                        </a>
                      ),
                      overlay: () => (
                        <Menu onClick={menuItem => handleMenuClick(rowIdx, colIdx, menuItem.key)}>
                          <MenuItem key="insertLeftCol">
                            <a target="_blank" rel="noopener noreferrer">
                              插入左侧列
                            </a>
                          </MenuItem>
                          <MenuItem key="insertRightCol">
                            <a target="_blank" rel="noopener noreferrer">
                              插入右侧列
                            </a>
                          </MenuItem>
                          <MenuItem key="insertUpRow">
                            <a target="_blank" rel="noopener noreferrer">
                              插入上方行
                            </a>
                          </MenuItem>
                          <MenuItem key="insertDownRow">
                            <a target="_blank" rel="noopener noreferrer">
                              插入下方行
                            </a>
                          </MenuItem>
                          <MenuDivider />
                          <MenuItem
                            key="mergeLeftCol"
                            disabled={colIdx <= 0 || rows[rowIdx][colIdx - 1].rowspan !== colOption.rowspan}
                          >
                            <a target="_blank" rel="noopener noreferrer">
                              合并左侧单元格
                            </a>
                          </MenuItem>
                          <MenuItem key="mergeRightCol" disabled={mergeRightColDisabled}>
                            <a target="_blank" rel="noopener noreferrer">
                              合并右侧单元格
                            </a>
                          </MenuItem>
                          <MenuItem
                            key="mergeWholeRow"
                            disabled={rows[rowIdx].length <= 1 || rows[rowIdx].length === colOption.colspan}
                          >
                            <a target="_blank" rel="noopener noreferrer">
                              合并整行
                            </a>
                          </MenuItem>
                          <MenuDivider />
                          <MenuItem
                            key="mergeUpRow"
                            disabled={rowIdx <= 0 || rows[rowIdx - 1][colIdx].colspan !== colOption.colspan}
                          >
                            <a target="_blank" rel="noopener noreferrer">
                              合并上方单元格
                            </a>
                          </MenuItem>
                          <MenuItem key="mergeDownRow" disabled={mergeBelowRowDisabled}>
                            <a target="_blank" rel="noopener noreferrer">
                              合并下方单元格
                            </a>
                          </MenuItem>
                          <MenuItem
                            key="mergeWholeCol"
                            disabled={rows.length <= 1 || rows.length === colOption.rowspan}
                          >
                            <a target="_blank" rel="noopener noreferrer">
                              合并整列
                            </a>
                          </MenuItem>
                          <MenuDivider />
                          <MenuItem key="undoMergeRow" disabled={colOption.rowspan <= 1}>
                            <a target="_blank" rel="noopener noreferrer">
                              撤销行合并
                            </a>
                          </MenuItem>
                          <MenuItem key="undoMergeCol" disabled={colOption.colspan <= 1}>
                            <a target="_blank" rel="noopener noreferrer">
                              撤销列合并
                            </a>
                          </MenuItem>
                          <MenuDivider />
                          <MenuItem
                            key="deleteWholeRow"
                            disabled={rows.length === 1 || colOption.rowspan === rows.length}
                          >
                            <a target="_blank" rel="noopener noreferrer">
                              删除整行
                            </a>
                          </MenuItem>
                          <MenuItem
                            key="deleteWholeCol"
                            disabled={rows[rowIdx].length === 1 || colOption.colspan === rows[rowIdx].length}
                          >
                            <a target="_blank" rel="noopener noreferrer">
                              删除整列
                            </a>
                          </MenuItem>
                        </Menu>
                      )
                    }}
                  />
                </div>
              );
            default:
              return null;
          }
        })()}
      </div>
    </>
  );
};

const RenderTable = defineComponent({
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
      const { schema } = props.item;

      const { flatten, frProps = {} } = store;
      const { labelWidth, displayType, showValidate } = frProps;
      const { title, description, required } = schema;

      const effectiveLabelWidth = getParentProps('labelWidth', props._id, flatten) || labelWidth;
      const _labelWidth = isLooselyNumber(effectiveLabelWidth)
        ? Number(effectiveLabelWidth)
        : isCssLength(effectiveLabelWidth)
        ? effectiveLabelWidth
        : '110'; // 默认是 110px 的长度

      let labelStyle = { width: _labelWidth + 'px' };
      if (props.isComplex || displayType === 'column') {
        labelStyle = { flexGrow: 1 };
      }
      
      let contentStyle = {};
      if (displayType === 'row') {
        contentStyle.marginLeft = effectiveLabelWidth;
      }
      const sProps = schema.props || {};
      const { rows } = schema;
      return (
        <>
          {schema.title ? (
            <div class={props.labelClass} style={labelStyle}>
              <label
                class={`fr-label-title ${displayType === 'column' ? 'no-colon' : ''}`} // checkbox不带冒号
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
            <table class={`table-layout ${sProps.customClass}`} border={sProps.border}>
              <tbody>
                {(rows || []).map((cols, rowIdx) => (
                  <tr>
                    {cols && cols.length
                      ? cols.map((col, colIdx) =>
                          !col.merged ? (
                            <td colspan={col.colspan || 1} rowspan={col.rowspan || 1} class="fr-generator-container">
                              <Wrapper
                                _id={`${props._id}|${rowIdx}|${colIdx}`}
                                item={props.item}
                                inside
                                style={{ padding: '6px', border: 'none' }}
                                v-slots={{
                                  default: () => {
                                    return (col.widgets || []).length > 0 ? (
                                      <ul class={`flex flex-wrap pl0`}>
                                        <RenderChildren _children={col.widgets.map(d => `${props._id}/${d}`)} />
                                      </ul>
                                    ) : null;
                                  },
                                  widgetBtns: () => widgetBtns(store, schema, props._id, rowIdx, colIdx)
                                }}
                              />
                            </td>
                          ) : null
                        )
                      : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    };
  }
});

export default RenderTable;
