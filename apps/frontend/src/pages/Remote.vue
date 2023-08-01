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

        <v-list density="compact" nav>
          <v-list-item
            v-for="window of listWindows"
            prepend-icon="mdi-remote-desktop"
            :active="isDisableMap[window._id] || false"
            :disabled="isDisableMap[window._id]"
            :title="window.name || window._id"
            :value="window._id"
            @click="cloudStore.addSelected(window)"
          ></v-list-item>

          <RemoteExitButton />
        </v-list> 
      </v-navigation-drawer>

      <!-- windows -->
      <v-main style="height: 100vh;">
        <div class="main" v-bind:class="{ 'has-drag': state.hasDrag }">
          <vue-draggable-resizable 
            v-for="window of windows"
            :resizable="false"
            :key="window._id"
            :x="cloudStore.initialX[window._id]"
            :y="cloudStore.initialY[window._id]"
            @mousedown="cloudStore.moveTopSelected(window)"
          >
            <div class="window">
              <div class="header-window" @mouseenter="onHoverDrag" @mouseleave="onBlurDrag">
                <div style="display: flex;">
                  <span class="title-window">
                    {{ window.name || window._id }}
                  </span>
                  <v-btn
                    :loading="isLoadingRestartMap[window._id]"
                    size="auto"
                    variant="text"
                    density="compact"
                    @click="onRestart(window)"
                  >
                    <v-icon>mdi-restart</v-icon>
                    <v-tooltip
                      activator="parent"
                      location="top"
                    >Restart</v-tooltip>
                  </v-btn>
                </div>
                <v-btn size="auto" variant="text" density="compact"  @click="cloudStore.removeSelected(window)">
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

.title-window {
  display: inline-block;
  white-space: nowrap; 
  max-width: 150px; 
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { computed } from 'vue';
import { shallowRef } from 'vue';
import { defineAsyncComponent } from 'vue';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
import { CloudDto } from '../dtos/cloud';
import { useCloudStore } from '../stores/cloud.store';
import { onMounted } from 'vue';
import { useCloudActionStore } from '../stores/cloud-action.store';
import { cloudService } from '../apis/cloud';
import { CloudActionType } from '../dtos/cloud-action';

const VueDraggableResizable = shallowRef(defineAsyncComponent(() => import('vue3-draggable-resizable')));
const Novnc = shallowRef(defineAsyncComponent(() => import('../components/Novnc.vue')));
const RemoteExitButton = shallowRef(defineAsyncComponent(() => import('../components/RemoteExitButton.vue')));

const cloudStore = useCloudStore();
const cloudActionStore = useCloudActionStore();
const reloadActionCloudRef = ref<any>();

const state = reactive({
  hasDrag: false,
  drawer: true,
  rail: true,
});

const listWindows = computed(() => {
  return cloudStore.list.filter((cloud) => cloud.stage === 'running');
});

const windows = computed(() => {
  return cloudStore.cloudSelected.map((id) => cloudStore.listMap[id])
});

const isDisableMap = computed(() => windows.value.reduce((val, item) => {
  val[item._id] = true;
  return val;
}, {} as { [key: string]: boolean }));

const isLoadingRestartMap = computed(() => cloudActionStore.master.reduce((val, item) => {
  val[item.dockerContainerId] = val[item.dockerContainerId] || item.jobDockerType === CloudActionType.Restart;
  return val;
}, {} as SMap<boolean>));


watch(() => cloudActionStore.master, (current) => {
  if (current?.length) {
    if (!reloadActionCloudRef.value) {
      console.log('register reload action!');
      reloadActionCloudRef.value = setInterval(() => {
        cloudActionStore.loadAll();
      }, 2000); 
    }
  } else {
    if (!!reloadActionCloudRef.value) {
      console.log('clear reload action!');
      clearInterval(reloadActionCloudRef.value);
      reloadActionCloudRef.value = null;
    }
  }
})

watch(() => cloudActionStore.masterLength, (current, prev) => {
  if (current < prev) {
    cloudStore.loadAll(true);
  }
})

onMounted(() => {
  cloudStore.loadAll();
})

const onHoverDrag = () => {
  state.hasDrag = true;
}

const onBlurDrag = () => {
  state.hasDrag = false;
}

const onRestart = (window: CloudDto) => {
  cloudService.restart(window._id)
    .then(() => {})
    .finally(() => {
      cloudActionStore.loadAll();
    })
}

</script>