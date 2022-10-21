<script setup>
import { ref } from 'vue';
import Generator, { defaultSettings } from './Generator';
import 'form-render-vue3/dist/style.css';
import 'ant-design-vue/dist/antd.css';

const defaultValue = ref({
  type: 'object',
  properties: {}
});

const changeTheme = () => {
  if (defaultValue.value.type === 'object') {
    defaultValue.value = {
      type: 'object:table',
      props: {
        border: true,
        customClass: '',
        hideTitle: false,
        rows: [
          [
            {
              merged: false,
              colspan: 1,
              rowspan: 1,
              widgets: ['select2']
            }
          ]
        ]
      },
      properties: {
        select2: {
          title: '单选',
          type: 'string',
          widget: 'select',
          enum: ['a', 'b', 'c'],
          enumNames: ['早上', '中午', '晚上']
        }
      }
    };
  } else {
    defaultValue.value = {
      type: 'object',
      properties: {}
    };
  }
};

const settings = [...defaultSettings];
settings[2].widgets = [
  ...settings[2].widgets,
  {
    text: '表格对象',
    name: 'object:table',
    schema: {
      title: '表格对象',
      type: 'object:table',
      props: {
        border: true,
        customClass: '',
        hideTitle: true,
        rows: [
          [
            {
              merged: false,
              colspan: 1,
              rowspan: 1,
              widgets: []
            },
            {
              merged: false,
              colspan: 2,
              rowspan: 1,
              widgets: ['input3']
            }
          ],
          [
            {
              merged: false,
              colspan: 1,
              rowspan: 1,
              widgets: ['input4']
            },
            {
              merged: false,
              colspan: 1,
              rowspan: 1,
              widgets: []
            },
            {
              merged: false,
              colspan: 1,
              rowspan: 2,
              widgets: ['select2']
            }
          ],
          [
            {
              merged: false,
              colspan: 2,
              rowspan: 1,
              widgets: ['input2', 'input5']
            },
            {
              merged: true,
              colspan: 1,
              rowspan: 1,
              widgets: []
            }
          ]
        ]
      },
      properties: {
        select2: {
          title: '单选',
          type: 'string',
          widget: 'select',
          enum: ['a', 'b', 'c'],
          enumNames: ['早上', '中午', '晚上']
        },
        input2: {
          title: '输入框2',
          type: 'string',
          required: true
        },
        input3: {
          title: '输入框3',
          type: 'string',
          required: true
        },
        input4: {
          title: '输入框4',
          type: 'string',
          required: true
        },
        input5: {
          title: '输入框5',
          type: 'string',
          required: true
        }
      }
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
  }
];
</script>

<template>
  <Generator
    :settings="defaultSettings"
    :defaultValue="defaultValue"
    :extraButtons="[{ text: `根主题(对象或表格)`, onclick: changeTheme }]"
  />
</template>
<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
</style>
