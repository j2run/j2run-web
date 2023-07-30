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
          to="/manage/create"
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
          to="/remote-dock"
        >
          Cửa sổ điều khiển
        </v-btn>
      </v-card-item>
    </v-card>

    <CloudItem
      v-for="cloud of cloudStore.list"
      :cloud="cloud"
      />
  </div>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { defineAsyncComponent, shallowRef } from 'vue';
import { useGameStore } from '../stores/game.store';
import { useCloudStore } from '../stores/cloud.store';
import { onMounted } from 'vue';
import { usePlanStore } from '../stores/plan.store';

const CloudItem = shallowRef(defineAsyncComponent(() => import('../components/CloudItem.vue')));

const gameStore = useGameStore();
const cloudStore = useCloudStore();
const planStore = usePlanStore();

onMounted(() => {
  gameStore.loadAll();
  planStore.loadAll();
  cloudStore.loadAll();
})
</script>