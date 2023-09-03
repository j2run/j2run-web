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
        :lines="false"
        density="compact"
        nav
      >
        <v-list-item
          v-for="(item, i) in state.items"
          :key="i"
          :value="item"
          :to="item.to"
          :exact="true"
          color="primary"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>

          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
        <Logout />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :elevation="0" border class="toolbar">
      <v-app-bar-nav-icon @click="state.drawer = !state.drawer"></v-app-bar-nav-icon>
      <v-row class="toolbar-main">
        <div class="toolbar-title">
          Máy ảo
        </div>
        <v-spacer></v-spacer>
        <div v-if="!isMobile">
          <span class="balance">{{ balance }}</span>
          <span class="email">
            {{ user.email }}
          </span>
          <LogoutButton />
        </div>
      </v-row>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped lang="scss">
:deep(.menu-wrapper) {
  &.v-navigation-drawer {
    background: var(--header-background) !important;
    color: var(--header-text) !important;
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

  .email {
    font-weight: 500;
    font-size: 13px;
    margin-right: 6px;
  }

  .balance {
    font-weight: bold;
    font-size: 14px;
    margin-right: 15px;
    color: #00a81c;
  }
}

</style>

<script setup lang="ts">
import { defineAsyncComponent, reactive, shallowRef, watch } from 'vue';
import { ref } from 'vue'
import { useDisplay } from 'vuetify';
import { useAuthStore } from '../../stores/auth.store';
import { computed } from 'vue';
import { formatVnd } from '../../utils/common';

const authStore = useAuthStore();
const display = ref(useDisplay());
const drawerTimer = ref<NodeJS.Timeout | undefined>();
const Logout = shallowRef(defineAsyncComponent(() => import('../Logout.vue')));
const Logo = shallowRef(defineAsyncComponent(() => import('../Logo.vue')));
const LogoutButton = shallowRef(defineAsyncComponent(() => import('../LogoutButton.vue')));

const user = authStore.user;

const balance = computed(() => formatVnd(user.balance));

const state = reactive({
  drawer: !display.value?.smAndDown,
  drawerDelay: !display.value?.smAndDown,
  items: [
    { text: 'Máy ảo', icon: 'mdi-cloud', to: '/manage' },
    { text: 'Cửa sổ', icon: 'mdi-remote-desktop', to: '/remote-dock' },
  ],
});

const isMobile = computed(() => display.value.smAndDown);

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

</script>