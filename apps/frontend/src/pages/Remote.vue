<template>
  <v-app id="inspire">
    <v-navigation-drawer
      class="menu-wrapper"
      :class="{
        mobile: isMobile
      }"
      :model-value="state.drawer || !isMobile"
      :permanent="!isMobile"
      :temporary="isMobile"
      :rail="!state.drawer"
      @update:model-value="e => state.drawer = e"
    >
      <v-list
        class="mx-3 my-2"
        :elevation="0"
        :class="{ 'text-center': !state.drawerDelay }"
      >
        <Logo :size="22" :short="!isMobile && !state.drawerDelay" />
        <v-icon
          class="close-menu"
          v-if="isMobile"
          @click="state.drawer = false"
        >
          mdi-close
        </v-icon>
      </v-list>

      <v-divider></v-divider>

      <v-list
        class="j2-menu"
        :lines="false"
        density="compact"
        nav
      >
        <v-tooltip
          v-if="!isMobile && !state.drawer"
          v-for="window of listWindows"
          :key="window._id"
          :text="window.name || window._id"
          content-class="tooltip-menu-custom"
        >
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-remote-desktop"
              :active="isDisableMap[window._id] || false"
              :disabled="isDisableMap[window._id]"
              :title="window.name || window._id"
              :value="window._id"
              @click="cloudStore.addSelected(window)"
            ></v-list-item>
          </template>
        </v-tooltip>

        <template v-else>
          <v-list-item
            v-for="window of listWindows"
            prepend-icon="mdi-remote-desktop"
            :active="isDisableMap[window._id] || false"
            :disabled="isDisableMap[window._id]"
            :title="window.name || window._id"
            :value="window._id"
            @click="cloudStore.addSelected(window)"
          ></v-list-item>
        </template>
        
        <Logout />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :elevation="0" border class="toolbar">
      <v-app-bar-nav-icon @click="state.drawer = !state.drawer"></v-app-bar-nav-icon>
      <v-row class="toolbar-main">
        <div class="toolbar-title lh-60">
          Cửa sổ ảo
        </div>
        <v-spacer></v-spacer>
        <div v-if="!isMobile" class="lh-60">
          <RemoteExitButton />
        </div>
      </v-row>
    </v-app-bar>

    <!-- windows -->
    <v-main style="height: 100vh;" class="j2-main">
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
            <Novnc :connectionUrl="window.connectionUrl" :password="window.password" />
          </div>
        </vue-draggable-resizable>
      </div>
    </v-main>
  </v-app>
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

:deep(.menu-wrapper) {
  &.v-navigation-drawer {
    background: var(--header-background) !important;
    color: var(--header-text) !important;
  }

  &:not(.mobile) {
    &.v-navigation-drawer {
      border: 0;

      .v-list.j2-menu {


        .v-list-item {
          position: relative;
        }

        .v-list-item--disabled {
          opacity: 1;
        }

        .v-list-item--active {
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          background-color: var(--background-1);

          .v-list-item__prepend {
            color: var(--header-background);
          }

          .v-list-item__content {
            color: var(--header-background) !important;
            div {
              color: var(--header-background);
            }
          }

          .v-list-item__overlay {
            opacity: 0;
          }
        }
      }
    }
  }

  .v-list-item.v-list-item--active {
    background-color: #4e6999;
    color: white;

    div {
      color: white;
    }
  }

  &.mobile {
    width: 100% !important;
  }
  
  .close-menu {
    position: absolute;
    right: 10px;
    top: 18px;
  }
}


.toolbar {
  border-right: unset;
  .toolbar-main {
    margin: unset;
    margin-right: 10px;
    .toolbar-title {
      font-size: 18px !important;
    }
  }
}

.j2-main {
  background-color: #f5f5f5;
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
import { useDisplay } from 'vuetify';

const Logo = shallowRef(defineAsyncComponent(() => import('../components/Logo.vue')));
const VueDraggableResizable = shallowRef(defineAsyncComponent(() => import('vue3-draggable-resizable')));
const Novnc = shallowRef(defineAsyncComponent(() => import('../components/remote/Novnc.vue')));
const RemoteExitButton = shallowRef(defineAsyncComponent(() => import('../components/remote/RemoteExitButton.vue')));

const drawerTimer = ref<NodeJS.Timeout | undefined>();
const display = ref(useDisplay());
const cloudStore = useCloudStore();
const cloudActionStore = useCloudActionStore();
const reloadActionCloudRef = ref<any>();

const isMobile = computed(() => display.value.smAndDown);

const state = reactive({
  hasDrag: false,
  drawer: true,
  drawerDelay: true,
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
  val[item.dockerContainerId] = val[item.dockerContainerId] || 
    item.jobDockerType === CloudActionType.RestartGame ||
    item.jobDockerType === CloudActionType.Restart;
  return val;
}, {} as SMap<boolean>));

watch(() => state.drawer, (v) => {
  if (v) {
    state.drawerDelay = v;
    return;
  }
  if (drawerTimer.value) {
    clearTimeout(drawerTimer.value);
  }
  drawerTimer.value = setTimeout(() => {
    state.drawerDelay = v;
  }, 150);
})

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
  cloudService.restartGame(window._id)
    .then(() => {})
    .finally(() => {
      cloudActionStore.loadAll();
    })
}

</script>