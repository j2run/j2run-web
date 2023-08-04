<template>
  <div>
    <v-img
      class="mx-auto my-6"
      max-width="125"
      :src="j2runLogo"
    ></v-img>

    <v-card
      class="mx-auto mt-4 border pa-1"
      max-width="400px"
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
      max-width="400px"
      elevation="2"
      rounded="lg"
      v-else
    >
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
  </div>
</template>

<style scoped lang="scss">
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
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { email, maxLength, minLength, required, sameAs } from '@vuelidate/validators'
import j2runLogo from '../assets/j2run-logo.png'
import { authService } from '../apis/auth';
import { computed } from 'vue';

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