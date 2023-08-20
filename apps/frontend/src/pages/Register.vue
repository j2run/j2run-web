<template>
  <div class="wrapper">
    <effect-card />
    <v-card
      class="border pa-1"
      max-width="420px"
      elevation="2"
      rounded="lg"
      v-if="state.registerDone"
    >
      <v-card-text>
        <div class="text-h6">
          Chào mừng bạn đã đăng ký thành công!
        </div>
        <br />
        Vui lòng kiểm tra hộp thư đến của bạn để tìm email xác thực từ chúng tôi. Nếu bạn không nhận được email trong vòng vài phút, vui lòng kiểm tra hộp thư Spam hoặc thư rác.
      </v-card-text>
      <v-card-actions>
        <v-card-text class="text-center">
          <v-btn
            variant="plain"
            class="text-blue"
            to="/login"
          >
          Đăng nhập
          </v-btn>
        </v-card-text>
      </v-card-actions>
    </v-card>

    <v-card
      class="mx-auto mt-4 border pa-12 pb-8"
      max-width="420px"
      elevation="2"
      rounded="lg"
      v-else
    >
      <v-row justify="center" class="color-hb">
        <v-col cols="12" class="text-center">
          <v-icon class="icon-login">mdi-lock-open-outline</v-icon>
        </v-col>
        <v-col cols="12" class="text-center text-h5 font-unbounded mb-8">
          Đăng ký
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
        v-model.trim="state.email"
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

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Nhập lại mật khẩu
      </div>
      <v-text-field
        v-model="state.confirmPassword"
        :error-messages="v$.confirmPassword.$errors.map(e => e.$message as unknown as string)"
        :append-inner-icon="state.visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="state.visible ? 'text' : 'password'"
        density="compact"
        placeholder="Nhập lại mật khẩu"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        required
        @click:append-inner="state.visible = !state.visible"
        @input="v$.confirmPassword.$touch"
        @blur="v$.confirmPassword.$touch"
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
        Đăng ký
      </v-btn>

      <v-card-text class="text-center">
        <v-btn
          variant="plain"
          class="text-blue"
          to="/login"
        >
        <v-icon icon="mdi-chevron-left"></v-icon>Đã có tài khoản
        </v-btn>
      </v-card-text>
    </v-card>
    <footer-v2 />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  position: relative;
  margin: auto;
  max-width: 420px;
  margin-top: 3rem;
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
import { email, maxLength, minLength, required, sameAs } from '@vuelidate/validators'
import { authService } from '../apis/auth';
import { computed } from 'vue';

const EffectCard = shallowRef(defineAsyncComponent(() => import('../components/EffectCard.vue')));
const FooterV2 = shallowRef(defineAsyncComponent(() => import('../components/FooterV2.vue')));

const initialState = {
  password: '',
  confirmPassword: '',
  email: '',
}

const state = reactive({
  ...initialState,
  isLoading: false,
  visible: false,
  registerDone: false,
  toastMessage: '',
  toastType: 'error' as "error" | "success" | "warning" | "info" | undefined,
});

const passwordCmp = computed(() => state.password);

const rules = {
  password: {
    required,
    minLength: minLength(6),
    maxLength: maxLength(32),
  },
  confirmPassword: {
    required, sameAsPassword: sameAs(passwordCmp) 
  },
  email: { required, email },
};

const v$ = useVuelidate(rules, state);

const onLogin = async () => {
  if (v$.value.$invalid) {
    return;
  }
  state.isLoading = true;
  await authService.register(state.email, state.password)
    .finally(() => state.isLoading = false)
    .then(() => {
      state.registerDone = true;
    })
    .catch((e) => {
      state.toastMessage = e.response?.data?.message || 'Unknown';
      state.toastType = 'error';
    });
}
</script>