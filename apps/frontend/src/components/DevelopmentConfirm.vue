<template>
  <v-dialog
    v-model="state.dialog"
    persistent
    width="auto"
    max-width="500"
  >
    <v-card>
      <v-card-title>
        Trang web đang trong quá trình phát triển
      </v-card-title>
      <v-card-text class="text-body-1">
        Chúng tôi đang trong quá trình phát triển giao diện trang web để mang đến trải nghiệm tốt hơn. Giao diện có thể chưa hoàn thiện và gặp lỗi nhỏ. Dữ liệu của bạn được đảm bảo an toàn. Xin lỗi vì bất tiện này và cảm ơn sự kiên nhẫn của bạn!
      </v-card-text>
      <v-card-actions>
        <v-checkbox :label="'Không hiện lại trong 6 giờ'" v-model="state.isConfirm"></v-checkbox>
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