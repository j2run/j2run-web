<template>
  <div class="cto-parallax" data-aos="fade-up">
    <v-parallax
      :src="ctaBg"
      height="300"
    >
      <v-container class="h-100">
        <v-row class="h-100" align="center" justify="space-between">
          <v-col class="cto-body" cols="12" md="6">
            <div class="font-unbounded text-h5 my-3">Hành động ngay</div>
            Bắt đầu hoàn toàn miễn phí và dễ dàng. Bạn có thể đăng ký tài khoản trong một phút và ngay lập tức bắt đầu sử dụng tất cả các dịch vụ của chúng tôi.
          </v-col>
          <v-col class="text-right" cols="12" md="6">
            <v-btn class="getting-btn" variant="tonal" to="/register">Bắt đầu</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-parallax>
  </div>
</template>

<style lang="scss" scoped>
.cto-body {
  color: #fff;
  line-height: 1.7rem;
}

.cto-parallax {
  :deep(.v-responsive__content) {
    &::after {
      position: absolute;
      content: '';
      display: inline-block;
      width: 100%;
      height: 100%;
      background-color: rgba(40,58,90,0.9);
      top: 0;
      left: 0;
      z-index: -1;
    }
  }
}

:deep(.getting-btn) {
  font-family: Unbounded;
  border-radius: 50px;
  font-size: 14px;
  border: 2px solid #ffffff;
  color: #fff;
  .v-btn__underlay {
    background-color: transparent;
  }
  &:hover {
    background-color: #47b2e4;
    color: #fff;
  }
}
</style>

<script setup lang="ts">
import ctaBg from '../assets/cta-bg.jpg'
</script>