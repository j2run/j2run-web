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
            Quên mật khẩu
          </v-col>
        </v-row>
        <v-alert
          v-if="!!state.toastMessage"
          class="mb-3"
          :type="state.toastType"
          :text="state.toastMessage"
        ></v-alert>
        <template v-if="!state.hideForgot">
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
          <v-btn
            block
            class="mb-8"
            color="blue"
            size="large"
            variant="tonal"
            :loading="state.isLoading"
            @click="onLogin"
          >
            KIỂM TRA
          </v-btn>
        </template>

        <v-card-text class="text-center">
          <v-btn
            variant="plain"
            class="text-blue"
            to="/login"
          >
            <v-icon icon="mdi-chevron-left"></v-icon>Đăng nhập
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
import { email, required } from '@vuelidate/validators'
import { useAuthStore } from '../stores/auth.store';
import { authService } from '../apis/auth';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const EffectCard = shallowRef(defineAsyncComponent(() => import('../components/EffectCard.vue')));
const FooterV2 = shallowRef(defineAsyncComponent(() => import('../components/FooterV2.vue')));

const route = useRoute();

const initialState = {
  email: '',
  hideForgot: false,
}

const state = reactive({
  ...initialState,
  isLoading: false,
  toastMessage: '',
  toastType: 'error' as "error" | "success" | "warning" | "info" | undefined,
})

const rules = {
  email: { required, email },
}

const v$ = useVuelidate(rules, state)
const authStore = useAuthStore();

const onLogin = async () => {
  if (v$.value.$invalid) {
    return;
  }
  state.isLoading = true;
  await authService.forgotPassword(state.email)
    .finally(() => state.isLoading = false)
    .then(() => {
      state.toastMessage = 'Gửi yêu cầu đặt lại mật khẩu thành công, vui lòng kiểm tra email của bạn.';
      state.toastType = 'success';
      state.hideForgot = true;
    })
    .catch((e) => {
      state.toastMessage = e.response?.data?.message || 'Unknown';
      state.toastType = 'error';
    });
}

onMounted(() => {
  const qr = route.query;
  if (qr.code && qr.email) {
    state.isLoading = true;
    authService.verifyForgotPassword(qr.email as string, qr.code as string)
      .then((rs) => {
        authStore.setDataLogin(rs);
      })
      .finally(() => {
        state.isLoading = false;
      })
      .catch((e) => {
        state.toastMessage = e.response?.data?.message || 'Unknown'
        state.toastType = 'error';
      });
  }
})
</script>