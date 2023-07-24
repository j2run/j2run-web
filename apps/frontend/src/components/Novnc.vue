<template>
  <div>
    <div class="loading" v-if="state.isLoading">
      <v-progress-circular
        :size="30"
        color="#fff"
        indeterminate
      ></v-progress-circular>
    </div>
    <div 
      class="window"
      v-bind:class="{ 'is-hidden': state.isLoading }"
      ref="novncContainer"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.loading {
  padding: 10px;
  background-color: #262626;
  display: flex;
  align-items: center;
  justify-content: center;
}
.window {
  display: inline-block;
  background-color: black;
  &.is-hidden {
    display: none;
  }
}
</style>

<script lang="ts" setup>
import RFB from '@novnc/novnc/core/rfb.js';
import { onMounted, onUnmounted, reactive, ref } from 'vue';

const ip = '172.16.10.101';
const port = 32768;
const password = 'f002Wg$^';

const novncContainer = ref<HTMLDivElement>();
const state = reactive({
  novnc: null as RFB | null,
  isLoading: false,
});


onMounted(function () {
  console.log('mount');
  state.isLoading = true;
  const element = novncContainer.value as unknown as HTMLDivElement;
  const novnc = new RFB(element, `ws://${ip}:${port}`, {
    credentials: {
      password: password,
    },
  });
  // novnc.compressionLevel = 2;
  // novnc.qualityLevel = 6;
  novnc.addEventListener('connect', () => {
    state.isLoading = false;
    const desktopWidth = novnc._display._fbWidth;
    const desktopHeight = novnc._display._fbHeight;
    element.style.width = desktopWidth + 4 + 'px';
    element.style.height = desktopHeight + 4 + 'px';
  });
  state.novnc = novnc;
})

onUnmounted(function () {
  console.log('unmount');
})

</script>