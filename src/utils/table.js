import { message } from 'ant-design-vue';
const newCol = () =>
  new Object({
    merged: false,
    colspan: 1,
    rowspan: 1,
    widgets: []
  });

function setOpsOfMergedCols(rows, startRowIdx, startColIdx, newColspan, rowspan) {
  for (let i = startRowIdx; i < startRowIdx + rowspan; i++) {
    for (let j = startColIdx; j < startColIdx + newColspan; j++) {
      if (i === startRowIdx && j === startColIdx) {
        rows[i][j].colspan = newColspan; //合并后的主单元格
        continue;
      }

      rows[i][j].merged = true;
      rows[i][j].colspan = newColspan;
      rows[i][j].widgets = [];
    }
  }
}

function setOpsOfMergedRows(rows, startRowIdx, startColIdx, colspan, newRowspan) {
  for (let i = startRowIdx; i < startRowIdx + newRowspan; i++) {
    for (let j = startColIdx; j < startColIdx + colspan; j++) {
      if (i === startRowIdx && j === startColIdx) {
        rows[i][j].rowspan = newRowspan;
        continue;
      }

      rows[i][j].merged = true;
      rows[i][j].rowspan = newRowspan;
      rows[i][j].widgets = [];
    }
  }
}

export function insertCol(rows, rowIdx, colIdx, position = 'left') {
  const isLeft = position === 'left';
  let newColIdx = isLeft ? colIdx : colIdx + 1;
  if (!isLeft) {
    let tmpColIdx = newColIdx;
    let hasNextCol = false;
    while (tmpColIdx < rows[rowIdx].length) {
      if (!rows[rowIdx][tmpColIdx].merged) {
        newColIdx = tmpColIdx;
        hasNextCol = true;
        break;
      } else {
        tmpColIdx++;
      }
      if (!hasNextCol) {
        newColIdx = rows[rowIdx].length;
      }
    }
  }

  for (let i = 0; i < rows.length; i++) {
    const sourceCol = rows[i][newColIdx];
    if (sourceCol && sourceCol.merged) {
      rows[i].splice(newColIdx, 0, {
        ...newCol(),
        merged: true
      });
      for (let j = newColIdx; j >= 0; j--) {
        if (!rows[i][j].merged && rows[i][j].colspan > 1) {
          rows[i][j].colspan += 1;
          break;
        }
      }
    } else {
      rows[i].splice(newColIdx, 0, newCol());
    }
  }
}

export function insertRow(rows, rowIdx, colIdx, position = 'up') {
  const isUp = position === 'up';
  let newRowIdx = isUp ? rowIdx : rowIdx + 1;
  if (!isUp) {
    let tmpRowIdx = newRowIdx;
    let hasNextRow = false;
    while (tmpRowIdx < rows.length) {
      if (!rows[tmpRowIdx][colIdx].merged) {
        newRowIdx = tmpRowIdx;
        hasNextRow = true;
        break;
      } else {
        tmpRowIdx += rows[tmpRowIdx][colIdx].rowspan || 1;
      }
    }
    if (!hasNextRow) {
      newRowIdx = rows.length;
    }
  }

  let newRow = new Array(rows[0].length).fill(0).map(d => newCol());

  if (rows[newRowIdx]) {
    for (let i = 0; i < rows[newRowIdx].length; i++) {
      const sourceCol = rows[newRowIdx][i];
      if (sourceCol.merged) {
        newRow[i].merged = true;
        for (let j = newRowIdx; j >= 0; j--) {
          if (!rows[j][i].merged && rows[j][i].rowspan > 1) {
            rows[j][i].rowspan += 1;
            break;
          }
        }
      }
    }
  }
  rows.splice(newRowIdx, 0, newRow);
}

export function mergeCol(rows, rowIdx, colIdx, position = 'left') {
  const isLeft = position === 'left';
  if (isLeft) {
    let tmpColIdx = colIdx - 1;
    while (tmpColIdx >= 0) {
      if (!rows[rowIdx][tmpColIdx].merged) {
        rows[rowIdx][tmpColIdx].colspan += rows[rowIdx][colIdx].colspan;
        rows[rowIdx][colIdx].merged = true;
        break;
      } else {
        tmpColIdx--;
      }
    }
  } else {
    for (let i = colIdx + 1; i < rows[rowIdx].length; i++) {
      if (!rows[rowIdx][i].merged) {
        rows[rowIdx][colIdx].colspan += rows[rowIdx][i].colspan;
        rows[rowIdx][i].merged = true;
        break;
      }
    }
  }
}

export function mergeRow(rows, rowIdx, colIdx, position = 'up') {
  const isUp = position === 'up';
  if (isUp) {
    let tmpRowIdx = rowIdx - 1;
    while (tmpRowIdx >= 0) {
      debugger;
      if (!rows[tmpRowIdx][colIdx].merged) {
        rows[tmpRowIdx][colIdx].rowspan += rows[rowIdx][colIdx].rowspan;
        rows[rowIdx][colIdx].merged = true;
        break;
      } else {
        tmpRowIdx--;
      }
    }
  } else {
    for (let i = rowIdx + 1; i < rows.length; i++) {
      if (!rows[i][colIdx].merged) {
        rows[rowIdx][colIdx].rowspan += rows[i][colIdx].rowspan;
        rows[i][colIdx].merged = true;
        break;
      }
    }
  }
}

export function mergeIntoOneRow(rows, rowIdx) {
  for (let i = 1; i < rows[rowIdx].length; i++) {
    if (rows[rowIdx][i].rowspan !== rows[rowIdx][0].rowspan) {
      message.error('整行所有单元格行高不一致不可合并！');
      return;
    }
  }
  setOpsOfMergedCols(rows, rowIdx, 0, rows[rowIdx].length, rows[rowIdx][0].rowspan);
}

export function mergeIntoOneCol(rows, colIdx) {
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][colIdx].colspan !== rows[0][colIdx].colspan) {
      message.error('整列所有单元格列宽不一致不可合并！');
      return;
    }
  }
  setOpsOfMergedRows(rows, 0, colIdx, rows[0][colIdx].colspan, rows.length);
}

export function deleteOneCol(rows, colIdx) {
  let onlyOneColFlag = true;
  rows.forEach(row => {
    if (row[0].colspan !== rows[0].length) {
      onlyOneColFlag = false;
      return;
    }
  });

  if (onlyOneColFlag) {
    message.error('仅剩一列则不可删除！');
    return;
  }

  let startColspan = rows[0][colIdx].colspan;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][colIdx].colspan !== startColspan) {
      message.error('整列所有单元格列宽不一致不可删除！');
      return;
    }
  }

  rows.forEach(rItem => {
    rItem.splice(colIdx, startColspan);
  });
}

export function deleteOneRow(rows, rowIdx) {
  let onlyOneRowFlag = true;
  rows[0].forEach(col => {
    if (col.rowspan !== rows.length) {
      onlyOneRowFlag = false;
      return;
    }
  });

  if (onlyOneRowFlag) {
    message.error('仅剩一行则不可删除！');
    return;
  }

  let startRowspan = rows[rowIdx][0].rowspan;
  for (let i = 1; i < rows[rowIdx].length; i++) {
    if (rows[rowIdx][i].rowspan !== startRowspan) {
      message.error('整行所有单元格行高不一致不可删除！');
      return;
    }
  }

  rows.splice(rowIdx, startRowspan);
}

export function undoMerge(rows, rowIdx, colIdx) {
  const col = { ...rows[rowIdx][colIdx] };
  for (let i = rowIdx; i < rowIdx + col.rowspan; i++) {
    for (let j = colIdx; j < colIdx + col.colspan; j++) {
      rows[i][j].merged = false;
      rows[i][j].rowspan = 1;
      rows[i][j].colspan = 1;
    }
  }
}
