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

    <div class="ma-4">
      <v-alert
        v-for="ic of invoiceCloudStore.doing"
        class="mt-3"
        type="info"
        variant="tonal"
        border="start"
      >
        <span>
          #{{ ic._id }} <br />
          Đang khởi tạo máy chủ
        </span>
        <v-progress-linear
          class="mt-3"
          :model-value="ic.status === 'waiting' ? 10 : 60"
          color="info"
          buffer-value="0"
          stream
        ></v-progress-linear>
      </v-alert>

      <v-alert
        v-for="ic of invoiceCloudStore.error"
        class="mt-3 pointer"
        type="error"
        variant="tonal"
        border="start"
        @click="onErrorViewed(ic)"
      >
        <span>
          #{{ ic._id }} <br />
          Khởi tạo cloud thất bại, có thể hệ thống đang không đủ tài nguyên. Vui lòng thử lại sau
        </span>
      </v-alert>
    </div>

    <CloudItem
      v-for="cloud of cloudStore.list"
      :cloud="cloud"
      />
  </div>
</template>

<style scoped lang="scss">
.pointer {
  cursor: pointer;
}
</style>

<script setup lang="ts">
import { defineAsyncComponent, shallowRef } from 'vue';
import { useGameStore } from '../stores/game.store';
import { useCloudStore } from '../stores/cloud.store';
import { onMounted } from 'vue';
import { usePlanStore } from '../stores/plan.store';
import { useInvoiceCloudStore } from '../stores/invoice-cloud.store';
import { ref } from 'vue';
import { watch } from 'vue';
import { onUnmounted } from 'vue';
import { InvoiceCloudDto } from '../dtos/invoice-cloud';

const CloudItem = shallowRef(defineAsyncComponent(() => import('../components/CloudItem.vue')));

const gameStore = useGameStore();
const cloudStore = useCloudStore();
const planStore = usePlanStore();
const invoiceCloudStore = useInvoiceCloudStore();

const reloadInvoiceCloudRef = ref<any>();

watch(() => invoiceCloudStore.doing, (current) => {
  if (current?.length) {
    if (!reloadInvoiceCloudRef.value) {
      console.log('register reload doing!');
      reloadInvoiceCloudRef.value = setInterval(() => {
        invoiceCloudStore.loadDoing();
        invoiceCloudStore.loadError();
      }, 2000); 
    }
  } else {
    if (!!reloadInvoiceCloudRef.value) {
      console.log('clear reload doing!');
      clearInterval(reloadInvoiceCloudRef.value);
    }
  }
})

onMounted(() => {
  gameStore.loadAll();
  planStore.loadAll();
  cloudStore.loadAll();
  invoiceCloudStore.loadDoing();
  invoiceCloudStore.loadError();
})

onUnmounted(() => {
  if (!!reloadInvoiceCloudRef.value) {
    clearInterval(reloadInvoiceCloudRef.value);
  }
})

const onErrorViewed = (ic: InvoiceCloudDto) => {
  invoiceCloudStore.removeError(ic);
}
</script>