<template>
  <div class="ma-10">
    Oops!
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePageStore } from '../stores/app.store';

const appStore = usePageStore();

onMounted(() => {
  appStore.setBreadcrumbs([
    {
      title: 'Hồ sơ',
      to: '/manage/profile',
    }
  ]);
})
</script>