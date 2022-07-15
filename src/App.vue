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

const handleClick = () => {
  console.log(1111111111);
};
</script>

<template>
  <Generator :defaultValue="defaultValue" :extraButtons="[{ text: '去playground验证', onclick: handleClick }]" />
</template>
<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
</style>
