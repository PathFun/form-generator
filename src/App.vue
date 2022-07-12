<script setup>
import Generator from './Generator';
import 'form-render-vue3/dist/style.css';
import 'ant-design-vue/dist/antd.css';

const defaultValue = {
  type: 'object',
  properties: {
    inputName: {
      title: '简单输入框',
      type: 'string'
    }
  }
};
</script>

<template>
  <Generator :defaultValue="defaultValue" />
</template>
<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
</style>
