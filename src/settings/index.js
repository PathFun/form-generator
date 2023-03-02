// 只需写配置，方便可扩展
export const baseCommonSettings = {
  type: {
    title: '类型',
    type: 'string',
    hidden: '{{true}}'
  },
  widget: {
    title: '组件',
    type: 'string',
    hidden: '{{true}}'
  },
  format: {
    title: '格式',
    type: 'string',
    hidden: '{{true}}'
  }
};

export const defaultCommonSettings = {
  _id: {
    title: 'ID',
    description: '字段名称/英文',
    type: 'string',
    widget: 'idInput',
    require: true,
    rules: [
      {
        pattern: '^#/.+$',
        message: 'ID 必填'
      }
    ]
  },
  title: {
    title: '标题',
    type: 'string',
    widget: 'htmlInput'
  },
  displayType: {
    title: '标题展示模式',
    type: 'string',
    enum: ['row', 'column'],
    enumNames: ['同行', '单独一行'],
    widget: 'radio'
  },
  description: {
    title: '说明',
    type: 'string'
  },
  default: {
    title: '默认值',
    type: 'string'
  },
  required: {
    title: '必填',
    type: 'boolean'
  },
  placeholder: {
    title: '占位符',
    type: 'string'
  },
  bind: {
    title: 'Bind',
    type: 'string'
  },
  min: {
    title: '最小值',
    type: 'number'
  },
  max: {
    title: '最大值',
    type: 'number'
  },
  disabled: {
    title: '禁用',
    type: 'boolean'
  },
  readOnly: {
    title: '只读',
    type: 'boolean'
  },
  hidden: {
    title: '隐藏',
    type: 'boolean'
  },
  readOnlyWidget: {
    title: '只读组件',
    type: 'string'
  },
  width: {
    title: '元素宽度',
    type: 'string',
    widget: 'percentSlider'
  },
  labelWidth: {
    title: '标签宽度',
    description: '默认值120',
    type: 'number',
    widget: 'slider',
    max: 400,
    props: {
      hideNumber: true
    }
  }
};

// widget 用于指定 schema 右侧配置对应的 setting
export const elements = [
  {
    text: '输入框',
    name: 'input',
    schema: {
      title: '输入框',
      type: 'string'
    },
    setting: {
      props: {
        title: '选项',
        type: 'object',
        labelWidth: 80,
        properties: {
          allowClear: {
            title: '是否带清除按钮',
            description: '填写内容后才会出现x哦',
            type: 'boolean'
          },
          addonBefore: {
            title: '前tab',
            type: 'string'
          },
          addonAfter: {
            title: '后tab',
            type: 'string'
          },
          prefix: {
            title: '前缀',
            type: 'string'
          },
          suffix: {
            title: '后缀',
            type: 'string'
          }
        }
      },
      minLength: {
        title: '最短字数',
        type: 'number'
      },
      maxLength: {
        title: '最长字数',
        type: 'number'
      },
      pattern: {
        title: '校验正则表达式',
        type: 'string',
        props: {
          placeholder: '填写正则表达式'
        }
      }
    }
  },
  {
    text: '文本输入框',
    name: 'textarea',
    schema: {
      title: '编辑框',
      type: 'string',
      format: 'textarea'
    },
    setting: {
      props: {
        title: '选项',
        type: 'object',
        labelWidth: 80,
        properties: {
          autoSize: {
            title: '高度自动',
            type: 'boolean'
          },
          rows: {
            title: '指定高度',
            type: 'number'
          }
        }
      },
      minLength: {
        title: '最短字数',
        type: 'number'
      },
      maxLength: {
        title: '最长字数',
        type: 'number'
      },
      pattern: {
        title: '校验正则表达式',
        type: 'string',
        props: {
          placeholder: '填写正则表达式'
        }
      }
    }
  },
  {
    text: '日期选择',
    name: 'date',
    schema: {
      title: '日期选择',
      type: 'string',
      format: 'date'
    },
    setting: {
      format: {
        title: '格式',
        type: 'string',
        enum: ['dateTime', 'date', 'time'],
        enumNames: ['日期时间', '日期', '时间']
      }
    }
  },
  {
    text: '时间选择',
    name: 'time',
    show: false,
    schema: {
      title: '时间选择',
      type: 'string',
      format: 'time'
    },
    setting: {
      format: {
        title: '格式',
        type: 'string',
        enum: ['dateTime', 'date', 'time'],
        enumNames: ['日期时间', '日期', '时间']
      }
    }
  },
  {
    text: '数字输入框',
    name: 'number',
    schema: {
      title: '数字输入框',
      type: 'number'
    },
    setting: {
      default: {
        title: '默认值',
        type: 'number'
      }
    }
  },
  {
    text: '是否选择',
    name: 'checkbox',
    schema: {
      title: '是否选择',
      type: 'boolean',
      widget: 'checkbox'
    },
    setting: {
      default: {
        title: '是否默认勾选',
        type: 'boolean'
      }
    }
  },
  {
    text: '是否switch',
    name: 'switch',
    schema: {
      title: '是否选择',
      type: 'boolean',
      widget: 'switch'
    },
    setting: {
      default: {
        title: '是否默认开启',
        type: 'boolean'
      }
    }
  },
  {
    text: '下拉单选',
    name: 'select',
    schema: {
      title: '单选',
      type: 'string',
      enum: ['a', 'b', 'c'],
      enumNames: ['早', '中', '晚'],
      widget: 'select'
    },
    setting: {
      enumList: {
        title: '选项',
        type: 'array',
        widget: 'simpleList',
        className: 'frg-options-list',
        items: {
          type: 'object',
          properties: {
            value: {
              title: '',
              type: 'string',
              className: 'frg-options-input',
              props: {},
              placeholder: '字段'
            },
            label: {
              title: '',
              type: 'string',
              className: 'frg-options-input',
              props: {},
              placeholder: '名称'
            }
          }
        },
        props: {
          hideMove: true,
          hideCopy: true
        }
      }
    }
  },
  {
    text: '点击单选',
    name: 'radio',
    schema: {
      title: '单选',
      type: 'string',
      enum: ['a', 'b', 'c'],
      enumNames: ['早', '中', '晚'],
      widget: 'radio'
    },
    setting: {
      enumList: {
        title: '选项',
        type: 'array',
        widget: 'simpleList',
        className: 'frg-options-list',
        items: {
          type: 'object',
          properties: {
            value: {
              title: '',
              type: 'string',
              className: 'frg-options-input',
              props: {},
              placeholder: '字段'
            },
            label: {
              title: '',
              type: 'string',
              className: 'frg-options-input',
              props: {},
              placeholder: '名称'
            }
          }
        },
        props: {
          hideMove: true,
          hideCopy: true
        }
      }
    }
  },
  {
    text: '下拉多选',
    name: 'multiSelect',
    schema: {
      title: '多选',
      description: '下拉多选',
      type: 'array',
      items: {
        type: 'string'
      },
      enum: ['A', 'B', 'C', 'D'],
      enumNames: ['杭州', '武汉', '湖州', '贵阳'],
      widget: 'multiSelect'
    },
    setting: {
      default: {
        title: '默认值',
        type: 'array',
        widget: 'jsonInput'
      },
      enumList: {
        title: '选项',
        type: 'array',
        widget: 'simpleList',
        className: 'frg-options-list',
        items: {
          type: 'object',
          properties: {
            value: {
              title: '',
              type: 'string',
              className: 'frg-options-input',
              props: {},
              placeholder: '字段'
            },
            label: {
              title: '',
              type: 'string',
              className: 'frg-options-input',
              props: {},
              placeholder: '名称'
            }
          }
        },
        props: {
          hideMove: true,
          hideCopy: true
        }
      }
    }
  },
  {
    text: '点击多选',
    name: 'checkboxes',
    schema: {
      title: '多选',
      type: 'array',
      widget: 'checkboxes',
      items: {
        type: 'string'
      },
      enum: ['A', 'B', 'C', 'D'],
      enumNames: ['杭州', '武汉', '湖州', '贵阳']
    },
    setting: {
      default: {
        title: '默认值',
        type: 'array',
        widget: 'jsonInput'
      },
      enumList: {
        title: '选项',
        type: 'array',
        widget: 'simpleList',
        className: 'frg-options-list',
        items: {
          type: 'object',
          properties: {
            value: {
              title: '',
              type: 'string',
              className: 'frg-options-input',
              props: {},
              placeholder: '字段'
            },
            label: {
              title: '',
              type: 'string',
              className: 'frg-options-input',
              props: {},
              placeholder: '名称'
            }
          }
        },
        props: {
          hideMove: true,
          hideCopy: true
        }
      }
    }
  },
  {
    text: 'HTML',
    name: 'html',
    schema: {
      title: 'HTML',
      type: 'string',
      widget: 'html'
    },
    setting: {
      props: {
        type: 'object',
        properties: {
          value: {
            title: '展示内容',
            type: 'string'
          }
        }
      }
    }
  }
];

export const advancedElements = [
  {
    text: '日期范围',
    name: 'dateRange',
    schema: {
      title: '日期范围',
      type: 'range',
      format: 'dateTime',
      props: {
        placeholder: ['开始时间', '结束时间']
      }
    },
    setting: {
      format: {
        title: '类型',
        type: 'string',
        enum: ['dateTime', 'date'],
        enumNames: ['日期时间', '日期']
      }
    }
  },
  {
    text: '数字（slider）',
    name: 'slider',
    schema: {
      title: '带滑动条',
      type: 'number',
      widget: 'slider'
    },
    setting: {
      default: {
        title: '默认值',
        type: 'number'
      }
    }
  },
  {
    text: '图片展示',
    name: 'image',
    schema: {
      title: '图片展示',
      type: 'string',
      format: 'image'
    },
    setting: {}
  },
  {
    text: '颜色选择',
    name: 'color',
    schema: {
      title: '颜色选择',
      type: 'string',
      format: 'color'
    },
    setting: {}
  }
];

export const nestings = [
  {
    text: '对象',
    name: 'object',
    schema: {
      title: '对象',
      type: 'object',
      properties: {}
    },
    setting: {
      theme: {
        title: '主题',
        type: 'string',
        enum: ['collapse', 'collapse:pure', 'collapse:ghost', 'card', 'tile', 'flex'],
        enumNames: ['默认', '无框', '幽灵', '卡片', '平铺', '弹性'],
        default: 'collapse',
        widget: 'radio'
      },
      props: {
        title: '弹性布局',
        hidden: '{{"flex" !== formData.theme}}',
        type: 'object',
        theme: 'tile',
        properties: {
          style: {
            title: '布局样式',
            type: 'object',
            theme: 'flex',
            props: {
              style: {
                flexDirection: 'column'
              }
            },
            properties: {
              height: {
                title: '高度',
                description: 'height',
                type: 'string',
                widget: 'input'
              },
              flexDirection: {
                title: '布局方向',
                description: 'flex-direction',
                type: 'string',
                enum: ['row', 'row-reverse', 'column', 'column-reverse'],
                enumNames: ['横向', '横向反转', '纵向', '纵向反转'],
                widget: 'select'
              },
              flexWrap: {
                title: '换行方式',
                description: 'flex-wrap',
                type: 'string',
                enum: ['wrap', 'nowrap', 'wrap-reverse'],
                enumNames: ['换行', '不换行', '反向换行'],
                widget: 'select'
              },
              justifyContent: {
                title: '对齐方式',
                description: 'justify-content',
                type: 'string',
                enum: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
                enumNames: ['起点对齐', '终点对齐', '居中对齐', '两端对齐', '相同间距'],
                widget: 'select'
              },
              alignItems: {
                title: '轴对齐方式',
                description: 'align-items',
                type: 'string',
                enum: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
                enumNames: ['起点对齐', '终点对齐', '居中对齐', '基线对齐', '拉伸铺满'],
                widget: 'select'
              },
              alignContent: {
                title: '多轴线对齐',
                description: 'align-content',
                type: 'string',
                enum: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
                enumNames: ['起点对齐', '终点对齐', '居中对齐', '基线对齐', '拉伸铺满'],
                widget: 'select'
              }
            }
          }
        }
      },
      style: {
        title: '元素样式',
        type: 'object',
        properties: {
          background: {
            title: '背景',
            description: 'background',
            type: 'string',
            widget: 'color'
          },
          margin: {
            title: '外边距',
            description: 'margin',
            type: 'string',
            widget: 'input'
          },
          padding: {
            title: '内边距',
            description: 'padding',
            type: 'string',
            widget: 'input'
          },
          borderWidth: {
            title: '边框宽',
            description: 'border-width',
            type: 'string',
            widget: 'input'
          },
          borderStyle: {
            title: '边框样式',
            description: 'border-style',
            type: 'string',
            widget: 'input'
          },
          borderColor: {
            title: '边框颜色',
            description: 'border-color',
            type: 'string',
            widget: 'color'
          },
          borderRadius: {
            title: '圆角',
            description: 'border-radius',
            type: 'string',
            widget: 'input'
          },
          flex: {
            title: '弹性伸缩',
            description: 'flex',
            type: 'string',
            widget: 'input'
          },
          order: {
            title: '排列顺序',
            description: 'order',
            type: 'string',
            widget: 'input'
          },
          alignSelf: {
            title: '自身对齐',
            description: 'align-self',
            type: 'string',
            widget: 'input'
          }
        }
      }
    }
  },
  {
    text: '常规列表',
    name: 'list',
    schema: {
      title: '数组',
      type: 'array',
      items: {
        type: 'object',
        properties: {}
      }
    },
    setting: {
      default: {
        title: '默认值',
        type: 'array',
        widget: 'jsonInput'
      },
      items: {
        type: 'object',
        hidden: '{{true}}'
      },
      min: {
        title: '最小长度',
        type: 'number'
      },
      max: {
        title: '最大长度',
        type: 'number'
      },
      props: {
        title: '选项',
        type: 'object',
        properties: {
          foldable: {
            title: '是否可折叠',
            type: 'boolean'
          },
          hideDelete: {
            title: '隐藏删除按钮',
            type: 'string'
          },
          hideAdd: {
            title: '隐藏新增/复制按钮',
            type: 'string'
          }
        }
      }
    }
  },
  {
    text: '简单列表',
    name: 'simpleList',
    schema: {
      title: '数组',
      type: 'array',
      widget: 'simpleList',
      items: {
        type: 'object',
        properties: {}
      }
    },
    setting: {
      default: {
        title: '默认值',
        type: 'array',
        widget: 'jsonInput'
      },
      items: {
        type: 'object',
        hidden: '{{true}}'
      },
      min: {
        title: '最小长度',
        type: 'number'
      },
      max: {
        title: '最大长度',
        type: 'number'
      },
      props: {
        title: '选项',
        type: 'object',
        properties: {
          foldable: {
            title: '是否可折叠',
            type: 'boolean'
          },
          hideTitle: {
            title: '隐藏标题',
            type: 'boolean'
          },
          hideDelete: {
            title: '隐藏删除按钮',
            type: 'string'
          },
          hideAdd: {
            title: '隐藏新增/复制按钮',
            type: 'string'
          }
        }
      }
    }
  },
  {
    text: '表格列表',
    name: 'list2',
    schema: {
      title: '数组',
      type: 'array',
      widget: 'list2',
      items: {
        type: 'object',
        properties: {}
      }
    },
    setting: {
      default: {
        title: '默认值',
        type: 'array',
        widget: 'jsonInput'
      },
      items: {
        type: 'object',
        hidden: '{{true}}'
      },
      min: {
        title: '最小长度',
        type: 'number'
      },
      max: {
        title: '最大长度',
        type: 'number'
      },
      props: {
        title: '选项',
        type: 'object',
        properties: {
          foldable: {
            title: '是否可折叠',
            type: 'boolean'
          },
          hideDelete: {
            title: '隐藏删除按钮',
            type: 'string'
          },
          hideAdd: {
            title: '隐藏新增/复制按钮',
            type: 'string'
          },
          hideCopy: {
            title: '隐藏复制按钮',
            type: 'string'
          },
          hideMove: {
            title: '隐藏上下移动按钮',
            type: 'string'
          }
        }
      }
    }
  },
  {
    text: '表格对象',
    name: 'table',
    schema: {
      title: '表格对象',
      type: 'object',
      widget: 'table',
      rows: [
        [
          {
            merged: false,
            colspan: 1,
            rowspan: 1,
            widgets: []
          }
        ]
      ],
      props: {
        border: true,
        customClass: '',
        hideTitle: true
      },
      properties: {}
    },
    setting: {
      props: {
        type: 'object',
        properties: {
          border: {
            title: '表格边框',
            type: 'boolean'
          },
          hideTitle: {
            title: '隐藏标题',
            type: 'boolean'
          },
          customClass: {
            title: '自定义class',
            type: 'string'
          }
        }
      }
    }
  },
  {
    text: '复杂表格列表',
    name: 'drawerList',
    schema: {
      title: '数组',
      type: 'array',
      widget: 'drawerList',
      items: {
        type: 'object',
        properties: {}
      }
    },
    setting: {
      default: {
        title: '默认值',
        type: 'array',
        widget: 'jsonInput'
      },
      items: {
        type: 'object',
        hidden: '{{true}}'
      },
      min: {
        title: '最小长度',
        type: 'number'
      },
      max: {
        title: '最大长度',
        type: 'number'
      },
      props: {
        title: '选项',
        type: 'object',
        properties: {
          foldable: {
            title: '是否可折叠',
            type: 'boolean'
          },
          hideDelete: {
            title: '隐藏删除按钮',
            type: 'string'
          },
          hideAdd: {
            title: '隐藏新增/复制按钮',
            type: 'string'
          }
        }
      }
    }
  }
];

export const layouts = [
  {
    text: 'Card布局',
    name: 'layout_card',
    schema: {
      title: 'Card布局',
      widget: 'card',
      type: 'layout',
      properties: {},
      props: {
        style: {
          width: '100%'
        },
        size: 'small',
        extra: '<a href="#">更多</a>',
        cover:
          '<img alt="example" style="width: 100%;" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0109975ed61679a801215aa003eb61.jpg%403000w_1l_2o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1670908474&t=31add1fd2a1e3dd7741aa697f8392c1b"/>'
      }
    },
    setting: {
      title: {
        title: '卡片标题',
        type: 'string'
      },
      props: {
        title: 'Card组件参数',
        type: 'object',
        properties: {
          size: {
            title: '组件大小',
            type: 'string',
            enum: ['default', 'small'],
            enumNames: ['默认', '紧凑']
          },
          extra: {
            title: '卡片右上角的操作区域',
            type: 'string'
          },
          cover: {
            title: '卡片封面(slot)',
            type: 'string'
          }
        }
      }
    }
  },
  {
    text: 'Tab布局',
    name: 'layout_tab',
    schema: {
      title: '<span style="padding: 10px; display: block;">Tab布局组件</span>',
      type: 'layout',
      widget: 'tab',
      rows: [
        {
          tab: 'pane 1',
          widgets: []
        },
        {
          tab: 'pane 2',
          widgets: []
        }
      ],
      props: {
        size: 'small',
        centered: true,
        tabPosition: 'top'
      },
      properties: {}
    },
    setting: {
      title: {
        title: '标题',
        type: 'string'
      },
      rows: {
        title: '标签',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            tab: {
              title: 'tab名称',
              type: 'string',
              className: 'frg-options-input',
              placeholder: '名称'
            },
            widgets: {
              title: '页签包含组件',
              type: 'array',
              default: [],
              hidden: '{{true}}'
            }
          }
        },
        props: {
          hideMove: true,
          hideCopy: true
        }
      },
      props: {
        title: 'Tab布局组件参数',
        type: 'object',
        properties: {
          tabPosition: {
            title: '页签位置',
            type: 'string',
            default: 'top',
            enum: ['top', 'right', 'bottom', 'left'],
            enumNames: ['顶部', '右边', '底部', '左边']
          },
          centered: {
            title: '是否居中',
            type: 'boolean'
          },
          size: {
            title: '组件大小',
            type: 'string',
            enum: ['large', 'default', 'small'],
            enumNames: ['放大', '默认', '紧凑']
          }
        }
      }
    }
  }
];

export const defaultSettings = [
  {
    title: '基础组件',
    widgets: elements,
    show: true,
    useCommon: true
  },
  {
    title: '高级组件',
    widgets: advancedElements,
    useCommon: true
  },
  {
    title: '嵌套组件',
    widgets: nestings,
    useCommon: true
  },
  {
    title: '布局组件',
    widgets: layouts
  }
];

export const defaultGlobalSettings = {
  type: 'object',
  properties: {
    column: {
      title: '整体布局',
      type: 'number',
      enum: [1, 2, 3],
      enumNames: ['一行一列', '一行二列', '一行三列'],
      props: {
        placeholder: '默认一行一列'
      }
    },
    labelWidth: {
      title: '标签宽度',
      type: 'number',
      widget: 'slider',
      max: 300,
      default: 120,
      props: {
        hideNumber: true
      }
    },
    displayType: {
      title: '标签展示模式',
      type: 'string',
      default: 'row',
      enum: ['row', 'column'],
      enumNames: ['同行', '单独一行'],
      widget: 'radio'
    }
  }
};
