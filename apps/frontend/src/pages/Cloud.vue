<template>
  <div>
    <v-card :elevation="0" class="mt-4">
        <v-card-item>
          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            color="medium-emphasis"
            min-width="92"
            rounded
            variant="outlined"
          >
            Tạo máy ảo
          </v-btn>
          <v-btn
            class="me-2"
            prepend-icon="mdi-remote-desktop"
            color="medium-emphasis"
            min-width="92"
            rounded
            variant="outlined"
          >
            Cửa sổ điều khiển
          </v-btn>
        </v-card-item>
      </v-card>

      <CloudItem />
      <CloudItem />
      <CloudItem />
      <CloudItem />
      <CloudItem />
  </div>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { defineAsyncComponent, shallowRef } from 'vue';

const CloudItem = shallowRef(defineAsyncComponent(() => import('../components/CloudItem.vue')));
</script>