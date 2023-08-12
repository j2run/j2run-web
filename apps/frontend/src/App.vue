<template>
  <div>
    <DevelopmentConfirm />
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, shallowRef } from 'vue';


const DevelopmentConfirm = shallowRef(defineAsyncComponent(() => import('./components/DevelopmentConfirm.vue')));

</script>