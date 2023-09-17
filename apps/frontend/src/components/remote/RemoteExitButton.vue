<template>
  <v-dialog
    v-model="state.dialog"
    persistent
    width="auto"
  >
    <template v-slot:activator="{ props }">
      <v-list-item
        v-bind="props"
        base-color="orange"
        prepend-icon="mdi-logout"
        title="Thoát"
      ></v-list-item>
    </template>
    <v-card>
      <v-card-title>
        Bạn có muốn thoát không?
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
          Có
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const state = reactive({
  dialog: false
})

const onExit = () => {
  state.dialog = false;
  router.push('/manage');
}
</script>