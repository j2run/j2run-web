<template>
  <div>
    <div class="loading" v-if="state.isLoading || state.retry > 0">
      <v-progress-circular
        :size="30"
        color="#fff"
        indeterminate
      ></v-progress-circular>
      <div class="mt-5">
        Retry... ({{ state.retry + 1 }})
      </div>
    </div>
    <div
      class="window"
      v-bind:class="{ 'is-hidden': state.isLoading || state.retry > 0 }"
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
  flex-direction: column;
  color: aliceblue;
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
import { watch } from 'vue';
import { onMounted, onUnmounted, reactive, ref } from 'vue';

const props = defineProps(['connectionUrl', 'password']);
const tre = ref();

const isMounted = ref(false);
const novncContainer = ref<HTMLDivElement>();
const state = reactive({
  novnc: null as RFB | null,
  isLoading: false,
  retry: 0,
});

watch(() => props.connectionUrl, () => {
  newConnect();
});

onMounted(function () {
  isMounted.value = true;
  newConnect();
})

onUnmounted(function () {
  console.log('disconnect remote!');
  isMounted.value = false;
  state.novnc.disconnect();
  state.novnc = null;
})

const newConnect = () => {
  if (!isMounted.value) {
    return;
  }
  console.log('create new remote!');
  const { connectionUrl, password } = props;
  state.isLoading = true;
  if (state.novnc) {
    state.novnc.disconnect();
  }
  clearTimeout(tre.value);
  
  const element = novncContainer.value as unknown as HTMLDivElement;
  const novnc = new RFB(element, `${connectionUrl}`, {
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
    state.retry = 0;
  });
  novnc.addEventListener('disconnect', () => {
    state.isLoading = false;
    state.retry++;
    tre.value = setTimeout(() => newConnect(), 1000);
  });
  state.novnc = novnc;
}

</script>