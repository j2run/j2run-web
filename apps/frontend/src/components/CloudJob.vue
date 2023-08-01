<template>
  <v-alert
    class="mt-3"
    type="info"
    variant="tonal"
    border="start"
  >
    <span>
      Đang {{ des }} máy ảo
    </span>
    <v-progress-linear
      class="mt-3"
      model-value="20"
      color="info"
      buffer-value="0"
      stream
    ></v-progress-linear>
  </v-alert>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CloudActionDto, CloudActionType } from '../dtos/cloud-action';


const props = defineProps({
  action: {
    type: CloudActionDto,
    required: true,
  },
})

const des = computed(() => {
  switch (props.action.jobDockerType) {
    case CloudActionType.Start:
      return 'khởi động';

    case CloudActionType.Restart:
      return 'khởi động lại';

    case CloudActionType.Stop:
      return 'tắt';

    case CloudActionType.Remove:
      return 'xóa';

    default:
      return '-'
  }
})

</script>