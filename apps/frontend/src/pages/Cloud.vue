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
          Đang khởi tạo máy ảo
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
    <v-sheet v-if="cloudStore.list.length === 0">
      <div class="text-center text-overline ma-4">Chưa có máy ảo nào được khởi tạo</div>
    </v-sheet>
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
import { useCloudActionStore } from '../stores/cloud-action.store';

const CloudItem = shallowRef(defineAsyncComponent(() => import('../components/CloudItem.vue')));

const gameStore = useGameStore();
const cloudStore = useCloudStore();
const planStore = usePlanStore();
const invoiceCloudStore = useInvoiceCloudStore();
const cloudActionStore = useCloudActionStore();

const reloadInvoiceCloudRef = ref<any>();
const reloadActionCloudRef = ref<any>();

watch(() => invoiceCloudStore.doing, (current) => {
  if (current?.length) {
    if (!reloadInvoiceCloudRef.value) {
      console.log('register reload doing!');
      reloadInvoiceCloudRef.value = setInterval(() => {
        invoiceCloudStore.loadDoing();
      }, 2000); 
    }
  } else {
    if (!!reloadInvoiceCloudRef.value) {
      console.log('clear reload doing!');
      invoiceCloudStore.loadError();
      cloudStore.loadAll(true);
      clearInterval(reloadInvoiceCloudRef.value);
      reloadInvoiceCloudRef.value = null;
    }
  }
})


watch(() => cloudActionStore.master, (current) => {
  if (current?.length) {
    if (!reloadActionCloudRef.value) {
      console.log('register reload action!');
      reloadActionCloudRef.value = setInterval(() => {
        cloudActionStore.loadAll();
      }, 2000); 
    }
  } else {
    if (!!reloadActionCloudRef.value) {
      console.log('clear reload action!');
      cloudStore.loadAll(true);
      clearInterval(reloadActionCloudRef.value);
      reloadActionCloudRef.value = null;
    }
  }
})

onMounted(() => {
  gameStore.loadAll();
  planStore.loadAll();
  cloudStore.loadAll();
  invoiceCloudStore.loadDoing();
  invoiceCloudStore.loadError();
  cloudActionStore.loadAll();
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