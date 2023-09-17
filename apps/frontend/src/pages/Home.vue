<template>
  <v-app>
    <div id="home"></div>
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
              v-for="item of menuItems"
              class="text-none default-button"
              variant="plain"
              @click="pushHash(item.to)"
            >
              {{ item.name }}
            </v-btn>
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
        v-intersection-observer="onSectionIntersect(HASH_HOME)"
        :class="{
          mobile: !display.mdAndUp
        }"
        :style="{
          height: display.mdAndUp ? '75vh' : 'calc(100vh - 64px)'
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
                to="/trial"
              >
                Thử miễn phí
              </v-btn>
              <v-btn
                class="mt-2 text-none"
                variant="text"
                to="register"
                data-aos="fade-up"
              >
                Nhận 1.000vnđ trải nghiệm
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

      <section id="about" v-intersection-observer="onSectionIntersect(HASH_ABOUT)">
        <HomeAboutUs />
      </section>

      <section style="overflow-x: hidden">
        <HomeAdvantage />
      </section>

      <section class="mt-10">
        <HomeCallToAction />
      </section>

      <section id="pricing"  v-intersection-observer="onSectionIntersect(HASH_PRICING)">
        <HomePricing />
      </section>

      <section id="faq"  v-intersection-observer="onSectionIntersect(HASH_FAQ)">
        <HomeFAQ />
      </section>

      <section>
        <Footer />
      </section>
      
    </v-main>

    <v-navigation-drawer
      v-model="state.drawerMenu"
      location="top"
      temporary
      class="menu-mobile h-100"
      color="rgb(17 31 56)"
    >
      <v-list>
        <v-btn
          v-for="item of menuItems"
          class="text-none default-button"
          variant="plain"
          @click="pushHash(item.to)"
        >
          {{ item.name }}
        </v-btn>
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
  position: relative;

  &:not(.mobile)::after {
    content: '';
    display: block;
    position: absolute;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI3MHB4IiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyODAgMy40QzEwNTAuNTkgMTggMTAxOS40IDg0Ljg5IDczNC40MiA4NC44OWMtMzIwIDAtMzIwLTg0LjMtNjQwLTg0LjNDNTkuNC41OSAyOC4yIDEuNiAwIDMuNFYxNDBoMTI4MHoiIGZpbGwtb3BhY2l0eT0iLjMiLz48cGF0aCBkPSJNMCAyNC4zMWM0My40Ni01LjY5IDk0LjU2LTkuMjUgMTU4LjQyLTkuMjUgMzIwIDAgMzIwIDg5LjI0IDY0MCA4OS4yNCAyNTYuMTMgMCAzMDcuMjgtNTcuMTYgNDgxLjU4LTgwVjE0MEgweiIgZmlsbC1vcGFjaXR5PSIuNSIvPjxwYXRoIGQ9Ik0xMjgwIDUxLjc2Yy0yMDEgMTIuNDktMjQyLjQzIDUzLjQtNTEzLjU4IDUzLjQtMzIwIDAtMzIwLTU3LTY0MC01Ny00OC44NS4wMS05MC4yMSAxLjM1LTEyNi40MiAzLjZWMTQwaDEyODB6Ii8+PC9nPjwvc3ZnPg==');
    background-color: var(--header-background);
    mix-blend-mode: multiply;
    width: 100vw;
    height: 80px;
    bottom: -80px;
  }

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

:deep(.default-button) {
  font-weight: 700;
  color: white !important;
}

.menu-mobile {
  &:not(.v-navigation-drawer--active) {
    margin-top: -40px !important;
  }
  .reg-button, .login-button, .default-button {
    width: 100%;
    text-align: left;
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
import { onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { vIntersectionObserver } from '@vueuse/components';

import { useRoute } from 'vue-router';

import AOS from 'aos';
import 'aos/dist/aos.css';

import { router } from '../router';
import heroImg from '../assets/hero-img.png';
import { useWindowScroll } from '@vueuse/core';
import { watch } from 'vue';

const Logo = shallowRef(defineAsyncComponent(() => import('../components/Logo.vue')));
const HomeAboutUs = shallowRef(defineAsyncComponent(() => import('../components/home/HomeAboutUs.vue')));
const HomeAdvantage = shallowRef(defineAsyncComponent(() => import('../components/home/HomeAdvantage.vue')));
const Footer = shallowRef(defineAsyncComponent(() => import('../components/Footer.vue')));
const HomeCallToAction = shallowRef(defineAsyncComponent(() => import('../components/home/HomeCallToAction.vue')));
const HomePricing = shallowRef(defineAsyncComponent(() => import('../components/home/HomePricing.vue')));
const HomeFAQ = shallowRef(defineAsyncComponent(() => import('../components/home/HomeFAQ.vue')));

const HASH_HOME = '#home';
const HASH_ABOUT = '#about';
const HASH_PRICING = '#pricing';
const HASH_FAQ = '#faq';

const menuItems = [
  {
    name: 'Trang chủ',
    to: HASH_HOME
  },
  {
    name: 'Giới thiệu',
    to: HASH_ABOUT
  },
  {
    name: 'Dịch vụ',
    to: HASH_PRICING
  },
  {
    name: 'FAQ',
    to: HASH_FAQ
  },
];

const imageBanner = ref<HTMLImageElement>();
const display = ref(useDisplay());
const timeInit = ref(new Date().getTime());
const route = useRoute();
const { y } = useWindowScroll();

const state = reactive({
  isHeaderBlur: false,
  drawerMenu: false,
})

const gotoHash = (hash: string) => {
  const element = document.getElementById(hash.substring(1, hash.length));
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  } else {
    document.body.scrollTo(0, 0);
  }
}

const pushHash = (hash: string) => {
  router.push({ hash });
  gotoHash(hash);
}

const onSectionIntersect = (hash: string) => {
  return ((data) => {
    if (timeInit.value + 700 > new Date().getTime()) {
      return;
    }
    const d0 = data[0];
    if (d0.isIntersecting) {
      router.push({ hash });
    }
  }) as IntersectionObserverCallback
}

watch(() => y.value > 60, (v) => {
  state.isHeaderBlur = v;
});

onMounted(() => {
  AOS.init({
    once: true,
    delay: 100,
    duration: 700
  });
  setTimeout(() => {
    imageBanner.value?.classList.add('img-anim');
    gotoHash(route.hash);
  }, 400)
})


</script>