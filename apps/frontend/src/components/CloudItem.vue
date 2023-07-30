<template>
  <v-card
    class="ma-4"
    rounded="lg"
    variant="flat"
    color="#fefefe"
    border
  >
    <v-card-item>
      <v-card-title class="text-body-2 d-flex align-center">
        <v-icon
          color="#949cf7"
          icon="mdi-laptop"
          start
        ></v-icon>

        <span class="text-medium-emphasis font-weight-bold">
          {{ planCurrent?.name || props.cloud.planId }}
        </span>

        <v-spacer></v-spacer>

        <span class="text-medium-emphasis font-weight-bold">{{ expirationDate }}</span>
      </v-card-title>

      <div class="py-2">
        <div class="text-h6">{{ props.cloud.name || props.cloud._id }}</div>

        <div class="font-weight-light text-medium-emphasis">
          {{ gameCurrent.name || props.cloud.gameId }}
        </div>
        <CloudJob />
      </div>
    </v-card-item>

    <v-divider></v-divider>

    <div class="pa-4 d-flex align-center">
      <v-icon
        :color="colorStage"
        icon="mdi-adjust"
        start
      ></v-icon>
      <span class="text-overline">
        {{ props.cloud.status }}
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

      <CloudGameButton />

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
import { shallowRef, defineAsyncComponent, PropType, computed } from 'vue';
import { CloudDto } from '../dtos/cloud';
import { useGameStore } from '../stores/game.store';
import { usePlanStore } from '../stores/plan.store';
import moment from 'moment';


const CloudDeleteButton = shallowRef(defineAsyncComponent(() => import('./CloudDeleteButton.vue')));
const CloudConfirmButton = shallowRef(defineAsyncComponent(() => import('./CloudConfirmButton.vue')));
const CloudJob = shallowRef(defineAsyncComponent(() => import('./CloudJob.vue')));
const CloudGameButton = shallowRef(defineAsyncComponent(() => import('./CloudGameButton.vue')));

const gameStore = useGameStore();
const planStore = usePlanStore();

const props = defineProps({
  cloud: {
    type: Object as PropType<CloudDto>,
    required: true,
  }
});

const planCurrent = computed(() => {
  return planStore.masterMap[props.cloud.planId];
});

const gameCurrent = computed(() => {
  return gameStore.masterMap[props.cloud.gameId];
});

const expirationDate = computed(() => {
  return moment(props.cloud.expirationDate).format('DD/MM/YYYY H:mm:ss');
})

const colorStage = computed(() => {
  if (props.cloud.stage === 'running') {
    return 'green';
  }
  if (props.cloud.stage === 'restarting' || props.cloud.stage === 'removing') {
    return 'orange';
  }
  return 'red';
})


</script>