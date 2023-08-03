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
          {{ gameCurrent?.name || props.cloud.gameId }}
        </div>
        <CloudJob v-for="action of actions" :action="action" />
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
        :disabled="props.cloud.stage !== 'running' || states.isConfirmLoading || isActionDisabled"
        @click="onRemote()"
      >
        Điều khiển
      </v-btn>

      <!-- <CloudGameButton /> -->

      <CloudConfirmButton
        v-if="props.cloud.stage !== 'running'"
        icon="mdi-power"
        label="Khởi động"
        message="Bạn có muốn khởi động không?"
        :loading="states.isConfirmLoading"
        :disabled="isActionDisabled"
        @submit="onStart"
      />
      <template v-if="props.cloud.stage === 'running'">
        <CloudConfirmButton
          icon="mdi-restart"
          label="Khởi động lại"
          message="Bạn có muốn khởi động lại không?"
          :loading="states.isConfirmLoading"
          :disabled="isActionDisabled"
          @submit="onRestart"
        />
        <CloudConfirmButton
          icon="mdi-power"
          label="Tắt"
          message="Bạn có muốn tắt không?"
          :loading="states.isConfirmLoading"
          :disabled="isActionDisabled"
          @submit="onStop"
        />
      </template>
      <CloudResetButton
        :cloud="props.cloud"
        :disabled="isActionDisabled"
        />
      <CloudDeleteButton
        :cloud="props.cloud"
        :disabled="isActionDisabled"
        />
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { shallowRef, defineAsyncComponent, PropType, computed } from 'vue';
import { CloudDto } from '../dtos/cloud';
import { useGameStore } from '../stores/game.store';
import { usePlanStore } from '../stores/plan.store';
import moment from 'moment';
import { useCloudActionStore } from '../stores/cloud-action.store';
import { reactive } from 'vue';
import { cloudService } from '../apis/cloud';
import { useCloudStore } from '../stores/cloud.store';
import { router } from '../router';

const CloudDeleteButton = shallowRef(defineAsyncComponent(() => import('./CloudDeleteButton.vue')));
const CloudConfirmButton = shallowRef(defineAsyncComponent(() => import('./CloudConfirmButton.vue')));
const CloudJob = shallowRef(defineAsyncComponent(() => import('./CloudJob.vue')));
const CloudResetButton = shallowRef(defineAsyncComponent(() => import('./CloudResetButton.vue')));

const gameStore = useGameStore();
const planStore = usePlanStore();
const cloudActionStore = useCloudActionStore();
const cloudStore = useCloudStore();

const props = defineProps({
  cloud: {
    type: Object as PropType<CloudDto>,
    required: true,
  }
});

const states = reactive({
  isConfirmLoading: false
})

const actions = computed(() => {
  return cloudActionStore.masterMap[props.cloud._id] || [];
})

const isActionDisabled = computed(() => {
  return (cloudActionStore.masterMap[props.cloud._id] || []).length > 0;
})

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

const onStop = () => {
  states.isConfirmLoading = true;
  cloudService.stop(props.cloud._id)
    .then(() => {})
    .finally(() => {
      states.isConfirmLoading =  false;
      cloudActionStore.loadAll();
    })
}

const onRestart = () => {
  states.isConfirmLoading = true;
  cloudService.restart(props.cloud._id)
    .then(() => {})
    .finally(() => {
      states.isConfirmLoading =  false;
      cloudActionStore.loadAll();
    })
}

const onStart = () => {
  states.isConfirmLoading = true;
  cloudService.start(props.cloud._id)
    .then(() => {})
    .finally(() => {
      states.isConfirmLoading =  false;
      cloudActionStore.loadAll();
    })
}

const onRemote = () => {
  cloudStore.addSelected(props.cloud);
  router.push('/remote-dock');
}
</script>