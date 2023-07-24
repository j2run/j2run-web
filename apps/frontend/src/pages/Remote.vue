<template>
  <div v-bind:class="{ 'has-drag': state.hasDrag }">
    <vue-draggable-resizable :resizable="false">
      <div class="window">
        <div class="header-window" @mouseenter="onHoverDrag" @mouseleave="onBlurDrag"></div>
        <Novnc />
      </div>
    </vue-draggable-resizable>
    <vue-draggable-resizable :resizable="false">
      <div class="window">
        <div class="header-window" @mouseenter="onHoverDrag" @mouseleave="onBlurDrag"></div>
        <Novnc />
      </div>
    </vue-draggable-resizable>
    <vue-draggable-resizable :resizable="false">
      <div class="window">
        <div class="header-window" @mouseenter="onHoverDrag" @mouseleave="onBlurDrag"></div>
        <Novnc />
      </div>
    </vue-draggable-resizable>
    <vue-draggable-resizable :resizable="false">
      <div class="window">
        <div class="header-window" @mouseenter="onHoverDrag" @mouseleave="onBlurDrag"></div>
        <Novnc />
      </div>
    </vue-draggable-resizable>
    <vue-draggable-resizable :resizable="false">
      <div class="window">
        <div class="header-window" @mouseenter="onHoverDrag" @mouseleave="onBlurDrag"></div>
        <Novnc />
      </div>
    </vue-draggable-resizable>
  </div>
</template>

<style lang="scss" scoped>
.window {
  display: inline-block;
}
.header-window {
  background-color: black;
  height: 20px;
  width: 100%;
  cursor: move;
}

.has-drag {
  .header-window {
    background-color: black;
    height: 20px;
    width: 100%;
    cursor: move;

    ~ div {
      position: relative;
      &::after {
        position: absolute;
        display: inline-block;
        content: '';
        background-color: #ccc;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1;
        opacity: 0.5;
      }
    }
  }
}
</style>

<script lang="ts" setup>
import { reactive } from 'vue';
import { ref, defineAsyncComponent } from 'vue';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

const VueDraggableResizable = ref(defineAsyncComponent(() => import('vue3-draggable-resizable')));
const Novnc = ref(defineAsyncComponent(() => import('../components/Novnc.vue')));

const state = reactive({
  hasDrag: false,
})

const onHoverDrag = () => {
  console.log('oke');
  state.hasDrag = true;
}

const onBlurDrag = () => {
  state.hasDrag = false;
}


</script>