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
          v-for="(item, i) in menu"
          :key="i"
          :text="item.text"
          content-class="tooltip-menu-custom"
        >
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              color="primary"
              :value="item"
              :to="item.to"
              :exact="true"
              :disabled="routePath == item.to"
              :active="routePath == item.to"
              :class="{
                'color-white': i === 0
              }"
            >
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>

              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item>
          </template>
        </v-tooltip>

        <template v-else>
          <v-list-item
            v-for="(item, i) in menu"
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
        </template>
        
        <Logout />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :elevation="0" border class="toolbar">
      <v-app-bar-nav-icon @click="state.drawer = !state.drawer"></v-app-bar-nav-icon>
      <v-row class="toolbar-main">
        <div class="toolbar-title lh-60">
          {{ title }}
        </div>
        <v-spacer></v-spacer>
        <div v-if="!isMobile" class="lh-60">
          <span class="balance mr-5">
            {{ balance }}
            <v-tooltip text="Nạp tiền" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-plus-circle-outline"  
                  to="/manage/payment"
                ></v-btn>
              </template>
            </v-tooltip>
          </span>
          <span class="email">
            {{ user.email }}
          </span>
          <LogoutButton />
        </div>
      </v-row>
    </v-app-bar>

    <v-main class="j2-main">
      <v-card elevation="0" class="breadcrumbs">
        <v-breadcrumbs :items="breadcrumbsItems" class="py-3">
          <template v-slot:title="{ item }">
            {{ item.title }}
          </template>
        </v-breadcrumbs>
      </v-card>
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

  &:not(.mobile) {
    &.v-navigation-drawer {
      border: 0;

      .v-list.j2-menu {
        padding: 0;
        padding-left: 10px;
        padding-top: 10px;

        .v-list-item {
          position: relative;
          padding: 6px 10px;
        }

        .v-list-item--disabled {
          opacity: 1;
        }

        .v-list-item--active {
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;
          background-color: var(--background-1);

          &.color-white {
            background: white;
            &::after, &::before {
              box-shadow: 12px 18px 0px 6px white;
            }
          }

          &::after, &::before {
            position: absolute;
            display: inline-block;
            content: '';
            width: 20px;
            height: 20px;
            background-color: var(--header-background);
            opacity: 1;
            border: 0;
            border-radius: 100%;
            box-shadow: 12px 18px 0px 6px var(--background-1);
            z-index: -1;
            transition: unset;
          }

          &::after {
            left: unset;
            right: 0;
            top: -20px;
          }

          &::before {
            right: 0;
            bottom: -20px;
            transform: scaleY(-1);
          }

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

.j2-main {
  background-color: #f5f5f5;
}

.breadcrumbs {
  border-radius: 0;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  font-size: 14px;
}

</style>

<script setup lang="ts">
import { defineAsyncComponent, reactive, shallowRef, watch } from 'vue';
import { ref } from 'vue'
import { useDisplay } from 'vuetify';
import { useAuthStore } from '../../stores/auth.store';
import { computed } from 'vue';
import { formatVnd } from '../../utils/common';
import { useRoute } from 'vue-router';
import { usePageStore } from '../../stores/app.store';

const route = useRoute();
const authStore = useAuthStore();
const appStore = usePageStore();
const display = ref(useDisplay());
const drawerTimer = ref<NodeJS.Timeout | undefined>();
const Logout = shallowRef(defineAsyncComponent(() => import('../Logout.vue')));
const Logo = shallowRef(defineAsyncComponent(() => import('../Logo.vue')));
const LogoutButton = shallowRef(defineAsyncComponent(() => import('../LogoutButton.vue')));

const user = authStore.user;

const balance = computed(() => formatVnd(user.balance));

const menu = [
  { text: 'Máy ảo', icon: 'mdi-cloud', to: '/manage/cloud' },
  { text: 'Điều khiển', icon: 'mdi-remote-desktop', to: '/remote-dock' },
  { text: 'Thanh toán', icon: 'mdi-receipt-text-outline', to: '/manage/payment' },
  { text: 'Hồ sơ', icon: 'mdi-account', to: '/manage/profile' },
];

const state = reactive({
  drawer: false,
  drawerDelay: false,
});

const routePath = computed(() => menu.find((item) => route.path.startsWith(item.to))?.to);

const title = computed(() => {
  return menu.find((item) => item.to === routePath.value)?.text || 'Unknown';
});

const breadcrumbsItems = computed(() => {
  return [
    {
      title: 'Quản lý',
      to: '/manage/htop',
    },
    ...appStore.breadcrumbs,
  ];
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