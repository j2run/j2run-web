<template>
  <v-row class="ma-2">
    <v-col cols="9">
      <v-card
        class="mx-auto border"
        elevation="2"
        rounded="lg"
      >
        <v-card-title class="mt-2">Tạo mới cloud</v-card-title>

        <v-card-item>
          <v-row>
            <v-col>
              <div class="text-subtitle-1 text-medium-emphasis mb-1">Plan Cloud</div>
              <v-select
                variant="outlined"
                density="compact"
                style="max-width: 500px;"
                prepend-inner-icon="mdi-package-variant"
              ></v-select>
            </v-col>

            <v-col>
              <div class="text-subtitle-1 text-medium-emphasis mb-1">Thời gian</div>
              <v-select
                variant="outlined"
                density="compact"
                style="max-width: 300px;"
                prepend-inner-icon="mdi-clock-star-four-points-outline"
              ></v-select>
            </v-col>
          </v-row>

          <v-card
            class="mb-6"
            color="surface-variant"
            variant="tonal"
          >
            <v-card-text class="text-medium-emphasis text-caption">
              Cảnh báo: Hiện tại, chúng tôi cung cấp một số trò chơi phổ biến. Nếu trò chơi mà bạn muốn không có trong danh sách của chúng tôi, hãy yêu cầu qua Zalo. Chúng tôi sẽ xem xét và xử lý yêu cầu của bạn trong khoảng thời gian từ 15 phút đến 24 giờ. Rất mong được hỗ trợ bạn!
            </v-card-text>
          </v-card>

          <div class="text-subtitle-1 text-medium-emphasis mb-1">Tên Cloud</div>
          <v-text-field
            variant="outlined"
            density="compact"
            style="max-width: 500px;"
            prepend-inner-icon="mdi-rename-box"
          ></v-text-field>

          <div class="text-subtitle-1 text-medium-emphasis mb-1">Game</div>
          <v-select
            variant="outlined"
            density="compact"
            style="max-width: 500px;"
            prepend-inner-icon="mdi-gamepad-variant-outline"
          ></v-select>
        </v-card-item>

      </v-card>
    </v-col>
    <v-col cols="3">
      <v-card
        class="mx-auto border"
        elevation="2"
        rounded="lg"
      >
        <v-card-title class="mt-2">Hóa đơn</v-card-title>

        <v-card-text>
          <div class="mt-2">
            <span class="text-subtitle-2">Dịch vụ:</span>
            <span class="ml-2 font-weight-bold">Gói 1</span>
          </div>
          <div class="mt-2 mb-3">
            <span class="text-subtitle-2">Giá:</span>
            <span class="ml-2 font-weight-bold">20.000 vnđ</span>
          </div>
          <div class="mt-2 mb-3">
            <span class="text-subtitle-2">Thời gian:</span>
            <span class="ml-2 font-weight-bold">3 tháng</span>
          </div>
          <v-divider></v-divider>
          <div class="mt-2 text-h5 text-right">
            60.000 vnđ
          </div>
        </v-card-text>

        <v-card-actions class="ma-3 mt-0">
          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            variant="outlined"
          >
            Tạo mới
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>