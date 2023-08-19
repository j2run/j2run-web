<template>
  <v-container>
    <div class="text-center mt-15 mb-13 mx-2 text-h4 font-unbounded">
      <div
        class="line-bottom"
        data-aos="fade-up"
      >
        <span class="color-hb">J2Run</span> 
        <span class="ml-2">là gì?</span>
      </div>
    </div>
    <v-row>
      <v-col class="about-us" cols="12" :md="6" data-aos="fade-up">
        Chúng tôi tự hào giới thiệu hệ thống treo game J2ME hàng đầu, một nền tảng ảo hóa chơi game với tính bảo mật và cách ly tối đa. Hãy cùng chúng tôi trải nghiệm sự thuận tiện và hứng thú của việc chơi game J2ME thông qua hệ thống ảo hóa hàng đầu của chúng tôi.
      </v-col>
      <v-col class="about-us" cols="12" :md="6" data-aos="fade-up">
        Với chúng tôi, bạn sẽ được trải nghiệm những điểm đặc biệt sau:
        <v-list>
          <v-list-item prepend-icon="mdi-check-all" v-for="item of J2RunAdvantage">
            {{ item.title }}
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">

.line-bottom  {
  display: inline-block;
  position: relative;
  &::before {
    position: absolute;
    display: inline-block;
    content: '';
    width: 90%;
    height: 1px;
    background-color: #ccc;
    left: 5%;
    bottom: -10px;
  }
  &::after {
    position: absolute;
    display: inline-block;
    content: '';
    width: 30%;
    height: 3px;
    background-color: #47b2e4;
    left: 35%;
    bottom: -11px;
  }
}

.about-us{
  line-height: 1.8rem;
}
</style>


<script setup lang="ts">
import { J2RunAdvantage } from '../dtos/home';
</script>