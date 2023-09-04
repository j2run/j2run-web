<template>
  <v-dialog
    v-model="state.dialog"
    persistent
    width="auto"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-history"
        variant="text"
        color="red"
        :disabled="ps.disabled"
      >
        Khôi phục gốc
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        Xóa "{{ ps.cloud.name || ps.cloud._id }}" ?
      </v-card-title>
      <v-card-text>
        <v-checkbox :label="subTitle" v-model="state.isConfirm"></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="state.dialog = false"
        >
          Hủy
        </v-btn>
        <v-btn
          color="red"
          variant="text"
          :disabled="!state.isConfirm"
          :loading="state.isLoading"
          @click="onDelete"
        >
          Khôi phục
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { PropType, reactive } from 'vue';
import { CloudDto } from '../dtos/cloud';
import { cloudService } from '../apis/cloud';
import { useCloudActionStore } from '../stores/cloud-action.store';

const ps = defineProps({
  cloud: {
    type: Object as PropType<CloudDto>,
    required: true,
  },
  disabled: {
    type: Boolean,
  }
});

const cloudActionStore = useCloudActionStore();

const subTitle = 'Xóa toàn bộ cấu hình, thông tin tài khoản đã lưu trong máy ảo';

const state = reactive({
  dialog: false,
  isConfirm: false,
  isLoading: false,
})

const onDelete = () => {
  state.isLoading = true;
  cloudService.reset(ps.cloud._id)
    .then(() => {
      state.dialog = false;
      cloudActionStore.loadAll();
    })
    .finally(() => {
      state.isLoading = false;
    })
}
</script>