<template>
  <span class="logo" :style="{ fontSize: (props.size || 25) + 'px' }">
    <template v-if="props.short">
      J2
    </template>
    <template v-else>
      J2Run.com
    </template>
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
  },
  short: {
    type: Boolean,
    required: false,
  }
});

</script>