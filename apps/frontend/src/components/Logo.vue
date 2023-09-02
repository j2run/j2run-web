<template>
  <span class="logo" :style="{ fontSize: (props.size || 25) + 'px' }">
    J2Run.com
  </span>
</template>

<style lang="scss" scoped>
.logo {
  font-family: ADLaM_Display;
  font-weight: 400;
}
</style>

<script setup lang="ts">

const props = defineProps({
  size: {
    type: Number,
    required: false,
  }
});

</script>