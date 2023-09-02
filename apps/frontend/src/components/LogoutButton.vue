<template>
  <v-dialog
    v-model="state.dialog"
    persistent
    width="auto"
  >
    <template v-slot:activator="dg">
      <v-tooltip text="Đăng xuất">
        <template v-slot:activator="tt">
          <v-icon v-bind="{...dg.props, ...tt.props}" class="logout">
            mdi-logout
          </v-icon>
        </template>
      </v-tooltip>
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
<style scoped lang="scss">
.logout {
  margin: 0;
  padding: 0;
  color: #5c5c5c;
}
</style>

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