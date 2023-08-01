<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" permanent>
      <v-list :elevation="1">
        <v-list-item
          prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
          title="Nguyễn Gia Huy"
          subtitle="nguyengiahuy16@google.com"
        >
          <template v-slot:append>
            <v-btn
              size="small"
              variant="text"
              icon="mdi-menu-down"
            ></v-btn>
          </template>
        </v-list-item>
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

    <v-app-bar :elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Máy ảo</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { defineAsyncComponent, reactive, shallowRef } from 'vue';
import { ref } from 'vue'

const Logout = shallowRef(defineAsyncComponent(() => import('../Logout.vue')));

const state = reactive({
  items: [
    { text: 'Máy ảo', icon: 'mdi-cloud', to: '/manage' },
    // { text: 'Hóa đơn', icon: 'mdi-receipt-text', to: '/manage/invoice' },
    { text: 'Cửa sổ', icon: 'mdi-remote-desktop', to: '/remote-dock' },
  ],
});


const drawer = ref()
</script>