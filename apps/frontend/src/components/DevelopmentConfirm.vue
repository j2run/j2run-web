<template>
  <v-dialog
    v-model="state.dialog"
    persistent
    max-width="500"
    width="auto"
  >
    <v-card>
      <v-card-title>
        Trang web đang trong quá trình phát triển
      </v-card-title>
      <v-card-text class="text-body-1">
        Tài nguyên không đủ, dự kiến sẽ được cập nhật trước 10/2023.<br />
        <v-checkbox class="ma-0" :hide-details="true" :label="'Không hiện lại trong 6 giờ'" v-model="state.isConfirm"></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <div class="text-caption pa-4">
          Version: {{ buildTime }}
        </div>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="onHide"
        >
          Đồng ý
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import moment from 'moment';
import { onMounted } from 'vue';
import { reactive } from 'vue';

const buildTime = moment(+BUILD_TIME).format('DD/MM/YYYY HH:mm:ss');

const state = reactive({
  dialog: false,
  isConfirm: false,
  isLoading: false,
})

onMounted(() => {
  const timeDevConfirm = localStorage.getItem('timeDevConfirm');
  let isShowDialog = false;
  if (!timeDevConfirm) {
    isShowDialog = true;
  } else {
    const mt = moment(new Date(+timeDevConfirm)).add(6, 'hours');
    if (mt.isBefore(moment.now())) {
      isShowDialog = true;
    }
  }
  state.dialog = isShowDialog;
})

const onHide = () => {
  state.dialog = false;
  if (state.isConfirm) {
    localStorage.setItem('timeDevConfirm', new Date().getTime().toString());
  }
}

</script>