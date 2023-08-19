<template>
      <v-container>
      <div 
        class="mt-15 mb-13 mx-2 text-h5 font-unbounded"
        data-aos="zoom-in"
      >
        Những lợi ích của J2Run
      </div>
      <swiper
        data-aos="zoom-in"
        :slides-per-view="1"
        :space-between="50"
        :breakpoints="swiperBreakpoints"
        @swiper="onSwiper"
        style="overflow: inherit;"
      >
        <swiper-slide v-for="item of J2RunAdvantage" class="swiper-item">
          <v-icon :icon="item.icon" class="swiper-icon"></v-icon>
          <div class="font-unbounded swiper-title">
            {{ item.title }}
          </div>
          <div class="swiper-content">
            {{ item.content }}
          </div>
        </swiper-slide>
      </swiper>
      <v-row class="mt-5" data-aos="zoom-in">
        <v-spacer></v-spacer>
        <v-btn
          class="text-none page-btn"
          variant="tonal"
          @click="swiperRef.slidePrev()"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn
          class="text-none ml-2 page-btn"
          variant="tonal"
          @click="swiperRef.slideNext()"
        >
          Tiếp
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-row>
    </v-container>
</template>

<style lang="scss" scoped>
.swiper-item {
  background-color: rgb(239, 239, 239);
  padding: 15px;
  border-radius: 10px;
  height: auto !important;

  .swiper-icon {
    padding: 15px;
    border-radius: 10px;
    background-color: #fff;
  }

  .swiper-title {
    margin: 10px 0;
  }

  .swiper-content {
    line-height: 1.7rem;
  }
}


:deep(.page-btn) {
  font-family: Unbounded;
  border-radius: 50px;
  font-size: 14px;
  border: 2px solid #47b2e4;
  .v-btn__underlay {
    background-color: transparent;
  }
  &:hover {
    background-color: #47b2e4;
    color: #fff;
  }
}
</style>
<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import * as sr from 'swiper';
import 'swiper/css';
import { J2RunAdvantage } from '../dtos/home';
import { ref } from 'vue';

const swiperBreakpoints = {
  900:{ slidesPerView: 2 },
  1200:{ slidesPerView: 3 }
};

const swiperRef = ref<sr.Swiper>({} as sr.Swiper);
const onSwiper = (swiper: sr.Swiper) => {
  swiperRef.value = swiper;
}

</script>