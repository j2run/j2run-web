<template>
  <div>
    <v-row>
      <v-col cols="12" md="8" lg="9">
        <div class="text-h6 my-5 font-weight-bold ma-4">
          Tạo máy ảo
        </div>
        <!-- <v-card
          class="border ml-4 mb-4"
          elevation="0"
          :rounded="5"
        >
          <v-card-title class="font-16">Chọn game</v-card-title>
          <v-card-item>
          </v-card-item>
        </v-card> -->

        <v-card
          class="border ml-4"
          elevation="0"
          :rounded="0"
        >
          <v-card-item>
            <v-alert
              v-if="!!state.errorMessage"
              type="error"
              class="mb-3"
              :text="state.errorMessage"
            ></v-alert>

            <div class="text-subtitle-1 text-medium-emphasis mb-1">Plan Cloud</div>
            <v-select
              v-model="state.plan"
              variant="outlined"
              density="compact"
              style="max-width: 700px;"
              prepend-inner-icon="mdi-package-variant"
              :items="plans"
              :error-messages="(v$.plan.$errors.map(e => e.$message) as unknown as string)"
              @input="v$.plan.$touch"
              @blur="v$.plan.$touch"
            ></v-select>

            <v-card
              class="mb-6"
              color="surface-variant"
              variant="tonal"
            >
              <v-card-text class="text-medium-emphasis text-caption">
                Cảnh báo: Hiện tại, chúng tôi cung cấp một số trò chơi phổ biến. Nếu trò chơi mà bạn muốn không có trong danh sách của chúng tôi, hãy yêu cầu qua Zalo. Chúng tôi sẽ xem xét và xử lý yêu cầu của bạn trong khoảng thời gian từ 15 phút đến 24 giờ. Rất mong được hỗ trợ bạn!
              </v-card-text>
            </v-card>

            <div class="text-subtitle-1 text-medium-emphasis mb-1">Tên Cloud</div>
            <v-text-field
              variant="outlined"
              density="compact"
              style="max-width: 500px;"
              prepend-inner-icon="mdi-rename-box"
              v-model="state.name"
              :error-messages="(v$.name.$errors.map(e => e.$message) as unknown as string)"
              @input="v$.name.$touch"
              @blur="v$.name.$touch"
            ></v-text-field>

            <div class="text-subtitle-1 text-medium-emphasis mb-1">Game</div>
            <v-select
              v-model="state.game"
              variant="outlined"
              density="compact"
              style="max-width: 500px;"
              prepend-inner-icon="mdi-gamepad-variant-outline"
              :items="games"
              :error-messages="(v$.game.$errors.map(e => e.$message) as unknown as string)"
              @input="v$.game.$touch"
              @blur="v$.game.$touch"
            ></v-select>
          </v-card-item>

        </v-card>
      </v-col>
      <v-col cols="12" md="4" lg="3">
        <v-card
          class="mx-auto invoice"
          :elevation="0"
          :rounded="0"
        >
          <v-card-title class="mt-2">Hóa đơn</v-card-title>

          <template v-if="planSelected">
            <v-card-text>
              <div class="mt-2">
                <span class="text-subtitle-2">Dịch vụ:</span>
                <span class="ml-2 font-weight-bold">{{ planSelected.name }}</span>
              </div>
              <div class="mt-2 mb-3">
                <span class="text-subtitle-2">Giá:</span>
                <span class="ml-2 font-weight-bold">{{ formatVnd(planSelected.money) }}</span>
              </div>
              <div class="mt-2 mb-3">
                <span class="text-subtitle-2">Thời gian:</span>
                <span class="ml-2 font-weight-bold">{{ formatSecondsToTime(planSelected.usageSecond) }}</span>
              </div>
              <v-divider></v-divider>
              <div class="mt-2 text-h5 text-right">
                {{ formatVnd(planSelected.money) }}
              </div>
            </v-card-text>
          </template>

          <v-card-actions class="ma-3 mt-0">
            <v-spacer></v-spacer>

            <v-btn
              color="primary"
              variant="outlined"
              :disabled="isDisable"
              :loading="state.isLoading"
              @click="onCreate"
            >
              Tạo mới
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.invoice {
  border-left: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  height: calc(100vh - 123px);
}
</style>

<script setup lang="ts">
import { reactive } from 'vue';
import { onMounted } from 'vue';
import { formatCpu, formatSecondsToTime, formatVnd } from '../utils/common';
import useVuelidate from '@vuelidate/core';
import { maxLength, required } from '@vuelidate/validators';
import { computed } from 'vue';
import { cloudService } from '../apis/cloud';
import { router } from '../router';
import { nextTick } from 'vue';
import { useGameStore } from '../stores/game.store';
import { usePlanStore } from '../stores/plan.store';
import { usePageStore } from '../stores/app.store';

const gameStore = useGameStore();
const planStore = usePlanStore();
const appStore = usePageStore();

const state = reactive({
  plan: '' as string | null,
  game: '' as string | null,
  name: '' as string | null,
  isLoading: false,
  errorMessage: ''
})

const rules = {
  plan: {
    required,
  },
  game: { required },
  name: { 
    required,
    maxLength: maxLength(50)
  }
}

const plans = computed(() => {
  return planStore.master.map((plan) => ({
    value: plan._id,
    title: `${plan.name} (${formatSecondsToTime(plan.usageSecond)}) - ${formatVnd(plan.money)} - ${formatCpu(plan.cpu)} - FPS: ${plan.fps || 'Unlimited'}`
  }))
});

const games = computed(() => {
  return gameStore.master.map((game) => ({
    value: game._id,
    title: game.name,
  }));
});

const planSelected = computed(() => {
  return planStore.master.find((plan) => plan._id === state.plan);
})

const isDisable = computed(() => {
  return v$.value.$invalid;
});

const v$ = useVuelidate(rules, state);

onMounted(() => {
  planStore.loadAll();
  gameStore.loadAll();

  appStore.setBreadcrumbs([
    {
      title: 'Máy ảo',
      to: '/manage/cloud',
    },
    {
      title: 'Tạo máy ảo',
      to: '/manage/cloud/create',
    }
  ]);
});

const onCreate = () => {
  state.isLoading = true;
  cloudService.create({
    gameId: state.game as string,
    planId: state.plan as string,
    name: state.name as string
  }).then(() => {
    nextTick(() => {
      router.push('/manage');
    })
  }).catch((e) => {
    state.errorMessage = e.response?.data?.message || 'Unknown'
  }).finally(() => {
    state.isLoading = false;
  })
}

</script>