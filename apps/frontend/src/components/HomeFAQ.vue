<template>
  <v-container>
    <div class="text-center mt-15 mb-10 mx-2 text-h4 font-unbounded">
      <div
        class="line-bottom"
        data-aos="fade-up"
      >
        <span class="color-hb">Câu hỏi thường gặp</span> 
      </div>
    </div>
    <div class="text-center mb-10" data-aos="fade-up">
      Xin đừng ngần ngại liên hệ với chúng tôi qua chat trực tiếp hoặc Telegram, Zalo nếu bạn cần thêm thông tin hoặc hỗ trợ gì thêm.
    </div>
    <div>
      <v-expansion-panels multiple class="custom-expand">
        <v-expansion-panel v-for="item of helps" elevation="0">
          <v-expansion-panel-title class="color-hb font-weight-bold">
            <v-icon :icon="'mdi-help-circle-outline'"></v-icon>
            <span class="ml-2">
              {{ item.question }}
            </span>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            {{ item.answer }}
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
:deep(.custom-expand) {
  .v-expansion-panel {
    margin-bottom: 10px;
    background-color: #eeeeee;
    border-bottom-left-radius: 5px !important;
    border-bottom-right-radius: 5px !important;
    
    &::after {
      border: unset !important;
    }
  }
} 
</style>


<script setup lang="ts">
const helps = [
  {
    question: "Tôi có thể chạy các game J2ME như NSO, NRO không?",
    answer: "Chắc chắn. Hệ thống cho phép bạn hoàn toàn có thể chạy các game J2ME như NSO, NRO và nhiều ứng dụng khác một cách dễ dàng."
  },
  {
    question: "Có hoạt động 24/24, ngay cả khi tôi thoát khỏi bảng điều khiển?",
    answer: "Đúng vậy. Hệ thống sẽ tiếp tục hoạt động liên tục 24/24, ngay cả khi bạn đã thoát khỏi bảng điều khiển. Bạn hoàn toàn có thể yên tâm về việc này."
  },
  {
    question: "Hệ thống có đảm bảo an toàn cho dữ liệu không?",
    answer: "Tất nhiên. Chúng tôi cam kết không lưu trữ mật khẩu hoặc bất kỳ thông tin liên quan đến trò chơi của bạn trong cơ sở dữ liệu. Tất cả các trò chơi được ảo hóa và cách ly, đảm bảo tính riêng tư và an toàn cho dữ liệu của bạn."
  },
  {
    question: "Tôi có thể tự đăng ký treo game J2ME mà tôi cung cấp không?",
    answer: "Tất nhiên, bạn hoàn toàn có thể tự đăng ký treo các game J2ME mà bạn cung cấp. Tuy nhiên, để đảm bảo chất lượng và tính ổn định, chúng tôi yêu cầu bạn gửi yêu cầu và chờ quá trình kiểm duyệt trước khi có thể chạy chúng trên hệ thống."
  }
]
</script>