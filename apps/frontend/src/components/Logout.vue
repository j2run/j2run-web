<template>
  <v-dialog
    v-model="state.dialog"
    persistent
  >
    <template v-slot:activator="{ props }">
      <v-list-item
        v-bind="props"
        color="primary"
        prepend-icon="mdi-logout"
        title="Đăng xuất"
      ></v-list-item>
    </template>
    <v-card>
      <v-card-title>
        Bạn có muốn đăng xuất không?
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="state.dialog = false"
        >
          Không
        </v-btn>
        <v-btn
          color="red"
          variant="text"
          @click="onExit"
        >
          Đăng xuất
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAuthStore } from '../stores/auth.store';

const authStore = useAuthStore();

const state = reactive({
  dialog: false
})

const onExit = () => {
  state.dialog = false;
  authStore.logout();
}
</script>