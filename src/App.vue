<script setup>
import Generator from './Generator';
// import { computed, ref } from 'vue';
// const props = defineProps({
//   count: {
//     type: Number,
//     default: 10
//   }
// });
// const times = ref(2);
// const result = computed(() => props.count * times.value);
// defineExpose(props);
</script>

<template>
  <!-- <div>{{ count }} x {{ times }} = {{ result }}</div>
  <button @click="times += 1">x1</button> -->
  <Generator />
</template>

<style lang="less">
#app {
  margin-top: 60px;
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
