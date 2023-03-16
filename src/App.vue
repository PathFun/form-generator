<script setup>
import { reactive } from 'vue';
import 'form-render-vue3/dist/style.css';
import 'ant-design-vue/dist/antd.css';
import * as designWidgets from './designWidgets';
import { Generator } from './index.js';
import { defaultSettings } from './index.js';
import Divider from './test/Divider.vue';
import Alert from './test/Alert.vue';
import Table from './test/Table.vue';
import Grid from './test/Grid.vue';

const customSettings = [
  {
    text: '栅格',
    name: 'layout_grid',
    schema: {
      title: 'grid',
      type: 'layout',
      widget: 'grid',
      properties: {},
      rows: [{
        span: 24,
        widgets: []
      }]
    },
    setting: {
      row: {
        title: 'Row配置',
        type: 'object',
        properties: {
          gutter: {
            title: '栅格间隔',
            type: 'number'
          },
          align: {
            title: 'flex布局下的垂直对齐方式',
            description: 'flex 布局下生效',
            descType: 'icon',
            type: 'string',
            enum: ['top', 'middle', 'bottom'],
            enumNames: ['顶部', '居中', '底部'],
            default: 'top'
          },
          justify: {
            title: 'flex布局下的水平排列方式',
            description: 'flex 布局下生效',
            descType: 'icon',
            type: 'string',
            enum: ['start', 'end', 'center', 'space-around', 'space-between'],
            enumNames: ['起始', '末尾', '中间', '均匀分布', '两边分布'],
            default: 'start'
          },
          wrap: {
            title: '是否自动换行',
            type: 'boolean'
          }
        }
      },
      // 统一用rows代表一维嵌套布局或对象
      rows: {
        title: 'Col配置',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            flex: {
              title: 'flex 布局填充',
              type: 'string'
            },
            offset: {
              title: '栅格左侧的间隔格数',
              type: 'number'
            },
            pull: {
              title: '栅格向左移动格数',
              type: 'number'
            },
            push: {
              title: '栅格向右移动格数',
              type: 'number'
            },
            span: {
              title: '栅格占位格数',
              description: '为 0 时相当于 display: none',
              descType: 'icon',
              default: 24,
              type: 'number'
            },
            xs: {
              title: '<576px 响应式栅格',
              type: 'number'
            },
            sm: {
              title: '≥576px 响应式栅格',
              type: 'number'
            },
            md: {
              title: '≥768px 响应式栅格',
              type: 'number'
            },
            lg: {
              title: '≥992px 响应式栅格',
              type: 'number'
            },
            xl: {
              title: '≥1200px 响应式栅格',
              type: 'number'
            },
            xxl: {
              title: '≥1600px 响应式栅格',
              type: 'number'
            },
            widgets: {
              title: '页签包含组件',
              type: 'array',
              default: [],
              hidden: '{{true}}'
            }
          }
        }
      }
    }
  },
  {
    text: '分割线',
    name: 'layout_divider',
    schema: {
      title: 'divider',
      type: 'layout',
      widget: 'divider'
    },
    setting: {
      props: {
        title: '组件样式',
        type: 'object',
        properties: {
          text: {
            title: '标题',
            type: 'string'
          },
          dashed: {
            title: '是否虚线',
            type: 'boolean'
          },
          orientation: {
            title: '标题位置',
            type: 'string',
            enum: ['left', 'right', 'center'],
            enumNames: ['左侧', '右侧', '居中'],
            default: 'left',
            widget: 'radio'
          },
          orientationMargin: {
            title: '标题侧边距',
            type: 'number'
          },
          plain: {
            title: '是否正文样式',
            type: 'boolean'
          },
          type: {
            title: '水平或垂直类型',
            type: 'string',
            enum: ['horizontal', 'vertical'],
            enumNames: ['水平', '垂直'],
            default: 'horizontal',
            widget: 'radio'
          }
        }
      }
    }
  },
  {
    text: 'Alert警告提示',
    name: 'layout_alert',
    schema: {
      title: 'alert',
      type: 'layout',
      widget: 'alert',
      props: {
        closable: true,
        type: 'success'
      }
    },
    setting: {
      props: {
        title: '组件样式',
        type: 'object',
        properties: {
          banner: {
            title: '是否用作顶部公告',
            type: 'boolean'
          },
          closable: {
            title: '显示关闭按钮',
            type: 'boolean'
          },
          message: {
            title: '警告提示内容',
            type: 'string'
          },
          description: {
            title: '辅助性文字介绍',
            type: 'string'
          },
          showIcon: {
            title: '显示辅助图标',
            type: 'boolean'
          },
          closeText: {
            title: '自定义关闭按钮',
            type: 'string'
          },
          type: {
            title: '警告提示样式',
            type: 'string',
            enum: ['success', 'info', 'warning', 'error'],
            enumNames: ['成功', '默认', '提醒', '失败'],
            widget: 'radio'
          }
        }
      }
    }
  },
  {
    text: '数据表格',
    name: 'layout_table',
    schema: {
      title: 'layoutTable',
      type: 'layout',
      widget: 'layoutTable'
    },
    setting: {}
  }
];

const settings = [...defaultSettings];

settings[3].widgets.push(...customSettings);

const schema = reactive({
  type: 'object',
  properties: {}
});

const changeTheme = () => {
  if (!schema.widget) {
    Object.assign(schema, {
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
        hideTitle: false
      },
      properties: {}
    });
  } else {
    Object.assign(schema, {
      type: 'object',
      widget: '',
      properties: {}
    });
  }
};
</script>

<template>
  <Generator
    :schema="schema"
    :design-widgets="designWidgets"
    :settings="settings"
    :widgets="{ divider: Divider, alert: Alert, layoutTable: Table, grid: Grid }"
    :extra-buttons="[{ text: `根主题(对象或表格)`, onclick: changeTheme }]"
  />
</template>
<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
</style>
