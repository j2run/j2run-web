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
          color="primary"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>

          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
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
import { reactive } from 'vue';
import { ref } from 'vue'

const state = reactive({
  items: [
    { text: 'Máy ảo', icon: 'mdi-cloud' },
    { text: 'Hóa đơn', icon: 'mdi-receipt-text' },
    { text: 'Đăng xuất', icon: 'mdi-logout' },
  ],
});


const drawer = ref()
</script>