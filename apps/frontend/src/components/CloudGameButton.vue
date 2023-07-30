<template>
  <v-dialog
    v-model="state.dialog"
    persistent
    width="auto"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        border
        prepend-icon="mdi-pencil"
        variant="text"
        class="mr-1"
      >
        Đổi game
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5 mt-1">
      </v-card-title>
      <v-card-text>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="state.dialog = false"
        >
          Hủy
        </v-btn>
        <v-btn
          color="red"
          variant="text"
          @click="state.dialog = false"
        >
          Xóa
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const state = reactive({
  dialog: false
})
</script>