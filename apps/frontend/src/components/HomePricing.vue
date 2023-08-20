<template>
  <v-container>
    <div class="text-center mt-15 mb-13 mx-2 text-h4 font-unbounded">
      <div
        class="line-bottom"
        data-aos="fade-up"
      >
        <span class="color-hb">Dịch Vụ</span> 
      </div>
    </div>
    <v-row justify="center">
      <v-col v-for="plan of plans" cols="12" :md="6" :lg="4">
        <v-card :class="classMap[plan._id]" elevation="0" data-aos="fade-up">
          <span class="c-icon">
            <v-icon :icon="iconMap[plan._id]"></v-icon>
          </span>
          <v-card-title class="color-hb font-weight-bold">{{ plan.name }}</v-card-title>
          <v-card-text>
            <div class="color-hb text-h3">
              {{ formatVnd(plan.money) }}
            </div>
            <div class="color-hb ml-1">
              / {{ formatSecondsToTime(plan.usageSecond) }}
            </div>
          </v-card-text>
          <v-list>
            <v-list-item prepend-icon="mdi-check" v-for="des of descriptionMap[plan._id]">
              {{ des }}
            </v-list-item>
          </v-list>
          <v-card-actions class="ma-2">
            <v-btn  
              variant="tonal"
              class="text-none buy-button"
              v-if="plan.money === 0"
              to="/trial"
            >
              Thử ngay
            </v-btn>
            <v-btn  
              variant="tonal"
              class="text-none buy-button"
              v-else
              to="/register"
            >
              Mua ngay
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">

.buy-button {
  font-size: 16px;
  border-radius: 50px;
  padding: 5px 10px;
  transition: .5s;
}

.card-0 {
  background-color: rgb(245 245 245);
  border: 1px solid #e0e0e0;

  .c-icon {
    margin: 1rem;
    margin-bottom: 0;
    display: inline-block;
    padding: 12px;
    background-color: var(--header-background);
    color: #fff;
    border-radius: 10px;
  }

  :deep(.v-list) {
    background-color: rgb(245 245 245);
  }

  :deep(.buy-button) {
    color: #47b2e4;
    border: 1px solid #47b2e4;

    .v-btn__underlay {
      background-color: transparent;
    }
    &:hover {
      color: #fff;
      background-color: #47b2e4;
    }
  }
}

.card-1 {
  background-color: #fff;
  border: 2px solid var(--header-background);

  .c-icon {
    margin: 1rem;
    margin-bottom: 0;
    display: inline-block;
    padding: 12px;
    background-color: var(--header-background);
    color: #fff;
    border-radius: 10px;
  }

  :deep(.buy-button) {
    color: #fff;
    background: #47b2e4;

    .v-btn__underlay {
      background-color: transparent;
    }
    &:hover {
      color: #47b2e4;
      border: 1px solid #47b2e4;
      background-color: transparent;
    }
  }
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePlanStore } from '../stores/plan.store';
import { formatVnd } from '../utils/common';
import { formatSecondsToTime } from '../utils/common';
import { computed } from 'vue';
import { formatCpu, formatRam } from '../utils/common';
import { PlanDto } from '../dtos/plan';

const planStore = usePlanStore();

const plans = computed(() => {
  return [
    {
      _id: "____",
      name: "Miễn phí",
      cpu: -1,
      ram: 200,
      money: 0,
      usageSecond: 15 * 60,
    },
    ...planStore.master,
  ] as PlanDto[];
})

const classMap = computed(() => {
  return plans.value.reduce<SMap<string>>((val, item) => {
    if (item.usageSecond < 60 * 60 * 24) {
      val[item._id] = 'card-0';
    } else {
      val[item._id] = 'card-1';
    }
    return val;
  }, {})
});

const iconMap = computed(() => {
  return plans.value.reduce<SMap<string>>((val, item) => {
    if (item.usageSecond < 60 * 60 * 24) {
      val[item._id] = 'mdi-test-tube';
    } else {
      val[item._id] = 'mdi-fire';
    }
    return val;
  }, {})
});

const descriptionMap = computed(() => {
  return plans.value.reduce<SMap<string[]>>((val, item) => {
    let data = val[item._id];
    if (!val[item._id]) {
      data = val[item._id] = [];
    }
    data.push(formatCpu(item.cpu));
    data.push(formatRam(item.ram))
    if (item.usageSecond < 60 * 60 * 24) {
      data.push('Uptime: 90%');
    } else {
      data.push('Uptime: 99.9%');
    }
    data.push('Hỗ trợ điều khiển trên mobile');
    return val;
  }, {})
})

onMounted(() => {
  planStore.loadAll();
})

</script>