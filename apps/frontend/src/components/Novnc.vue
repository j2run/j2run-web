<template>
  <div ref="novncContainer" style="display: inline-block; background-color: black;"></div>
</template>

<script lang="ts" setup>
import RFB from '@novnc/novnc/core/rfb.js';
import { onMounted, reactive, ref } from 'vue';

const ip = '172.16.10.101';
const port = 32775;
const password = 'o4Nbw!zW';

const novncContainer = ref<HTMLDivElement>();
const state = reactive({
  novnc: null as RFB | null,
});

onMounted(function () {
  const element = novncContainer.value as unknown as HTMLDivElement;
  const novnc = new RFB(element, `ws://${ip}:${port}`, {
    credentials: {
      password: password,
    },
  });
  // novnc.compressionLevel = 2;
  // novnc.qualityLevel = 6;
  novnc.addEventListener('connect', () => {
    const desktopWidth = novnc._display._fbWidth;
    const desktopHeight = novnc._display._fbHeight;
    element.style.width = desktopWidth + 4 + 'px';
    element.style.height = desktopHeight + 4 + 'px';
  });
  state.novnc = novnc;
})

</script>