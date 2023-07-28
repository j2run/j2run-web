<template>
  <v-card
    class="ma-4"
    rounded="lg"
    variant="flat"
    border
  >
    <v-card-item>
      <v-card-title class="text-body-2 d-flex align-center">
        <v-icon
          color="#949cf7"
          icon="mdi-laptop"
          start
        ></v-icon>


        <span class="text-medium-emphasis font-weight-bold">Cloud 1</span>

        <v-spacer></v-spacer>

        <span class="text-medium-emphasis font-weight-bold">23/08/2023 - 9:00 PM</span>
      </v-card-title>

      <div class="py-2">
        <div class="text-h6">Live Q&A</div>

        <div class="font-weight-light text-medium-emphasis">
          Join the Vuetify team for a live Question and Answer session.
        </div>
      </div>
    </v-card-item>

    <v-divider></v-divider>

    <div class="pa-4 d-flex align-center">
      <v-icon
        color="green"
        icon="mdi-adjust"
        start
      ></v-icon>
      <span class="text-overline">
        Hoạt động
      </span>

      <v-spacer></v-spacer>

      <v-btn
        border
        prepend-icon="mdi-remote-desktop"
        variant="text"
        class="mr-1"
      >
        Điều khiển
      </v-btn>

      <CloudConfirmButton
        icon="mdi-restart"
        label="Khởi động lại"
        message="Bạn có muốn khởi động lại không?"
      />
      <CloudConfirmButton
        icon="mdi-power"
        label="Tắt"
        message="Bạn có muốn tắt không?"
      />
      <CloudDeleteButton />
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { shallowRef, defineAsyncComponent } from 'vue';


const CloudDeleteButton = shallowRef(defineAsyncComponent(() => import('./CloudDeleteButton.vue')));
const CloudConfirmButton = shallowRef(defineAsyncComponent(() => import('./CloudConfirmButton.vue')));


</script>