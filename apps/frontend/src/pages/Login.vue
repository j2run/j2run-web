<template>
  <div class="over-wrapper">
    <div class="wrapper">
      <effect-card />
      <v-card
        class="border pa-12 pb-8"
        max-width="420px"
        elevation="2"
        rounded="lg"
      >
        <v-row justify="center" class="color-hb">
          <v-col cols="12" class="text-center">
            <v-icon class="icon-login">mdi-lock-open-outline</v-icon>
          </v-col>
          <v-col cols="12" class="text-center text-h5 font-unbounded mb-8">
            Đăng nhập
          </v-col>
        </v-row>
        <v-alert
          v-if="!!state.toastMessage"
          class="mb-3"
          :type="state.toastType"
          :text="state.toastMessage"
        ></v-alert>
        <div class="text-subtitle-1 text-medium-emphasis">Tài khoản</div>
        <v-text-field
          v-model="state.email"
          :error-messages="(v$.email.$errors.map(e => e.$message) as unknown as string)"
          density="compact"
          placeholder="Địa chỉ email"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          required
          @input="v$.email.$touch"
          @blur="v$.email.$touch"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Mật khẩu

          <!-- <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            Quên mật khẩu?</a> -->
        </div>
        <v-text-field
          v-model="state.password"
          :error-messages="v$.password.$errors.map(e => e.$message as unknown as string)"
          :append-inner-icon="state.visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="state.visible ? 'text' : 'password'"
          density="compact"
          placeholder="Nhập mật khẩu"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          required
          @click:append-inner="state.visible = !state.visible"
          @input="v$.password.$touch"
          @blur="v$.password.$touch"
        ></v-text-field>

        <v-btn
          block
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          :loading="state.isLoading"
          @click="onLogin"
        >
          Đăng nhập
        </v-btn>

        <v-card-text class="text-center">
          <v-btn
            variant="plain"
            class="text-blue"
            to="/register"
          >
            Đăng ký ngay <v-icon icon="mdi-chevron-right"></v-icon>
          </v-btn>
          <br />
          <v-btn variant="plain"  class="text-blue" :to="'/'">
            Trang chủ
            <v-icon size="large">mdi-home-import-outline</v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
      <footer-v2 />
    </div>
  </div>
</template>

<style scoped lang="scss">
.over-wrapper {
  overflow: hidden;
  min-height: 100vh;
}

.wrapper {
  position: relative;
  margin: auto;
  max-width: 420px;
  margin-top: 4rem;
  padding: 6px;
}

.icon-login {
  font-size: 45px;
}

.title {
  .el-form-item__content b {
    font-size: 20px;
  }

  margin-bottom: 10px;
}
.logo {
  width: 100px;
  margin-bottom: 30px;
}
</style>

<script setup lang="ts">
import { defineAsyncComponent, reactive, shallowRef } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { email, maxLength, minLength, required } from '@vuelidate/validators'
import { useAuthStore } from '../stores/auth.store';
import { authService } from '../apis/auth';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { router } from '../router';

const EffectCard = shallowRef(defineAsyncComponent(() => import('../components/EffectCard.vue')));
const FooterV2 = shallowRef(defineAsyncComponent(() => import('../components/FooterV2.vue')));

const route = useRoute();

const initialState = {
  password: '',
  email: '',
  visible: false
}

const state = reactive({
  ...initialState,
  isLoading: false,
  toastMessage: '',
  toastType: 'error' as "error" | "success" | "warning" | "info" | undefined,
})

const rules = {
  password: {
    required,
    minLength: minLength(6),
    maxLength: maxLength(32),
  },
  email: { required, email },
}

const v$ = useVuelidate(rules, state)
const authStore = useAuthStore();

const onLogin = async () => {
  if (v$.value.$invalid) {
    return;
  }
  state.isLoading = true;
  await authStore.login(state.email, state.password)
    .finally(() => state.isLoading = false)
    .catch((e) => {
      state.toastMessage = e.response?.data?.message || 'Unknown';
      state.toastType = 'error';
    });
}

onMounted(() => {
  const qr = route.query;
  if (qr.code) {
    state.isLoading = true;
    authService.verify(qr.code as string)
      .finally(() => {
        state.isLoading = false;
        router.push('/login');
      })
      .then(() => {
        state.toastMessage = 'Xác thực tài khoản thành công';
        state.toastType = 'success';
      })
      .catch((e) => {
        state.toastMessage = e.response?.data?.message || 'Unknown'
        state.toastType = 'error';
      });
  }
})
</script>