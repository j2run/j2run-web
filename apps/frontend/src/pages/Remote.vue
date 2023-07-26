<template>
  <v-card>
    <v-layout>
      <!-- menu -->
      <v-navigation-drawer
        v-model="state.drawer"
        :rail="state.rail"
        :floating="false"
        permanent
        @click="state.rail = false"
      >
        <v-list-item
          prepend-avatar="https://www.clipartmax.com/png/middle/89-890778_blue-circle-cloud-icon-internet-clip-art-at-clker-cloud-icon-circle.png"
          title="J2Run"
          nav
        >
          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="state.rail = !state.rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav v-for="window of state.allWindows">
          <v-list-item
            prepend-icon="mdi-remote-desktop"
            :active="isDisableMap[window._id] || false"
            :disabled="isDisableMap[window._id]"
            :title="window.name || window._id"
            :value="window._id"
            @click="onAdd(window)"
            ></v-list-item>
        </v-list> 
      </v-navigation-drawer>

      <!-- windows -->
      <v-main style="height: 100vh;">
        <div class="main" v-bind:class="{ 'has-drag': state.hasDrag }">
          <vue-draggable-resizable 
            v-for="window of state.windows"
            :resizable="false"
            :key="window._id"
            :x="400"
            @mousedown="onMoveTop(window)"
          >
            <div class="window">
              <div class="header-window" @mouseenter="onHoverDrag" @mouseleave="onBlurDrag">
                <div>
                  {{ window.name }}
                  <v-btn size="auto" variant="text" density="compact" @click="onRestart(window)">
                    <v-icon>mdi-restart</v-icon>
                    <v-tooltip
                      activator="parent"
                      location="top"
                    >Restart</v-tooltip>
                  </v-btn>
                </div>
                <v-btn size="auto" variant="text" density="compact"  @click="onRemove(window)">
                  <v-icon>mdi-window-close</v-icon>
                  <v-tooltip
                    activator="parent"
                    location="top"
                  >Close</v-tooltip>
                </v-btn>
              </div>
              <Novnc :ip="window.forwardIp" :port="window.forwardPort" :password="window.password" />
            </div>
          </vue-draggable-resizable>
        </div>
      </v-main>
    </v-layout>
  </v-card>

</template>

<style lang="scss" scoped>
.main {
  &::after {
    content: 'J2Run';
    display: inline-block;
    position: fixed;
    z-index: -999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
    font-size: 60px;
    color: #999;
    opacity: 0.5;
  }
}
.window {
  position: relative;
  z-index: 5;
  display: inline-block;
  padding: 1px;
  min-width: 240px;
}
.header-window {
  display: flex;
  gap: 5px;
  justify-content: space-between;
  padding: 4px;
  background-color: black;
  color: #ccc;
  width: 100%;
  cursor: move;
}

.has-drag {
  .header-window {

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
        opacity: 0;
      }
    }
  }
}
</style>

<script lang="ts" setup>
import { reactive } from 'vue';
import { computed } from 'vue';
import { shallowRef } from 'vue';
import { defineAsyncComponent } from 'vue';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
import { CloudDto } from '../dtos/cloud';

const VueDraggableResizable = shallowRef(defineAsyncComponent(() => import('vue3-draggable-resizable')));
const Novnc = shallowRef(defineAsyncComponent(() => import('../components/Novnc.vue')));

const state = reactive({
  hasDrag: false,
  drawer: true,
  rail: true,
  windows: [] as CloudDto[],
  allWindows: [
    {
      _id: 'abc',
      name: 'Test 1',
      forwardIp: '172.16.10.101',
      forwardPort: 32769,
      password: '#X9Mro8Z'
    },
    {
      _id: '64be77da2f4302242e82ec31',
      forwardIp: '172.16.10.101',
      forwardPort: 32769,
      password: '#X9Mro8Z'
    },
  ] as CloudDto[],
})

const isDisableMap = computed(() => state.windows.reduce((val, item) => {
  val[item._id] = true;
  return val;
}, {} as { [key: string]: boolean }))

const onHoverDrag = () => {
  state.hasDrag = true;
}

const onBlurDrag = () => {
  state.hasDrag = false;
}

const onAdd = (window: CloudDto) => {
  state.windows.push(window);
}

const onRestart = (window: CloudDto) => {
  console.log(window);
}

const onRemove = (window: CloudDto) => {
  state.windows = state.windows.filter(w => w != window);
}

const onMoveTop = (window: CloudDto) => {
  state.windows = [
    ...state.windows.filter(w => w != window),
    window,
  ];
}

</script>