<template>
  <v-app>
    <v-app-bar
      class="header"
      elevation="0"
      :class="{
        blur: state.isHeaderBlur,
        mobile: !display.mdAndUp
      }"
    >
      <v-container>
        <v-row class="gap-5" align="center">
          <Logo />
          <v-spacer></v-spacer>

          <template v-if="display.mdAndUp">
            <v-btn
              class="text-none login-button"
              variant="tonal"
              to="/login"
            >
              Đăng nhập
            </v-btn>
            <v-btn
              class="text-none reg-button"
              variant="tonal"
              to="/register"
            >
              Đăng ký
            </v-btn>
          </template>
          <v-app-bar-nav-icon v-else variant="text" @click.stop="state.drawerMenu = !state.drawerMenu"></v-app-bar-nav-icon>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-main>
      <div
        class="getting"
        :class="{
          mobile: !display.mdAndUp
        }"
        :style="{
          height: display.mdAndUp ? '80vh' : 'calc(100vh - 64px)'
        }"
      >
        <v-container class="pl-2 h-100">
          <v-row
            class="h-100"
            justify="center"
            align="center"
            :class="{
              'flex-column': !display.mdAndUp
            }"
          >
            <v-col cols="0" md="6" :order="2" :order-md="1">
              <h1
                class="logen font-unbounded"
                data-aos="fade-up"
              >
                Giải pháp treo game Java J2ME dành cho game thủ.
              </h1>
              <v-btn
                class="mt-2 mr-2 text-none getting-button"
                variant="tonal"
                size="large"
                data-aos="fade-up"
                @click="test"
              >
                Thử miễn phí
              </v-btn>
              <v-btn
                class="mt-2 text-none"
                variant="text"
                to="register"
                data-aos="fade-up"
              >
                Nhận 6h treo miễn phí
              </v-btn>
            </v-col>
            <v-col cols="0" md="6" :order="1" :order-md="2">
              <img 
                :src="heroImg"
                :style="{
                  width: display.mdAndUp ? '100%' : '80%'
                }"
                ref="imageBanner"
                data-aos="zoom-in"
                />
            </v-col>
          </v-row>
        </v-container>
        <v-container class="h-100">
        </v-container>
      </div>

      <section>
        <HomeAboutUs />
      </section>

      <section>
        <HomeAdvantage />
      </section>

      <section>
        <Footer />
      </section>
      
    </v-main>

    <v-navigation-drawer
      v-model="state.drawerMenu"
      location="bottom"
      temporary
      class="menu-mobile"
      color="rgb(17 31 56)"
    >
      <v-list>
        <v-list-item>
          <v-btn
            class="text-none login-button"
            variant="tonal"
            to="/login"
          >
            Đăng nhập
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn
            class="text-none reg-button"
            variant="tonal"
            to="/register"
          >
            Đăng ký
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<style lang="scss" scoped>
.header {
  background: var(--header-background) !important;
  color: var(--header-text) !important;

  &.blur {
    background: rgba(40,58,90,.9) !important;
  }

  &.mobile {
    padding: 0 10px;
  }
}

.getting {
  background: var(--header-background) !important;
  color: var(--header-text) !important;


  &.mobile {
    text-align: center;

    .logen {
      margin-bottom: 20px;
    }
  }
}

.getting-button {
  font-size: 16px;
  border-radius: 50px;
  transition: .5s;
  color: #fff;
  background: #47b2e4;
}

:deep(.reg-button) {
  border-radius: 50px;
  color: #fff;
  font-size: 14px;
  border: 2px solid #47b2e4;
  .v-btn__underlay {
    background-color: transparent;
  }
  &:hover {
    background-color: #47b2e4;
  }
}

:deep(.login-button) {
  border-radius: 50px;
  color: #fff;
  font-size: 14px;
  border: 2px solid #229907;
  .v-btn__underlay {
    background-color: transparent;
  }
  &:hover {
    background-color: #229907;
  }
}

.menu-mobile {
  &:not(.v-navigation-drawer--active) {
    margin-top: -40px !important;
  }
  .reg-button, .login-button {
    width: 100%;
  }
}

.img-anim {
  animation: up-down 2s ease-in-out infinite alternate-reverse both;
}

@keyframes up-down {
  0% {
    transform: translateY(10px);
  }
  100% {
      transform: translateY(-10px);
  }
}
</style>

<script lang="ts" setup>
import { defineAsyncComponent, reactive, ref, shallowRef } from 'vue';
import { onUnmounted } from 'vue';
import { onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import heroImg from '../assets/hero-img.png';

import AOS from 'aos';
import 'aos/dist/aos.css';

const Logo = shallowRef(defineAsyncComponent(() => import('../components/Logo.vue')));
const HomeAboutUs = shallowRef(defineAsyncComponent(() => import('../components/HomeAboutUs.vue')));
const HomeAdvantage = shallowRef(defineAsyncComponent(() => import('../components/HomeAdvantage.vue')));
const Footer = shallowRef(defineAsyncComponent(() => import('../components/Footer.vue')));

const imageBanner = ref<HTMLImageElement>();
const display = ref(useDisplay())

const state = reactive({
  isHeaderBlur: false,
  drawerMenu: false,
})

const onWindowScroll = function () {
  state.isHeaderBlur = (window.scrollY > 60);
}

const test = () => {
  alert('Đang phát triễn, vui lòng chọn nhận 6h treo miễn phí!');
}

onMounted(() => {
  AOS.init({
    once: true,
    delay: 200,
  });
  window.addEventListener('scroll', onWindowScroll, false);
  setTimeout(() => {
    imageBanner.value?.classList.add('img-anim');
  }, 400)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onWindowScroll, false);
})

</script>