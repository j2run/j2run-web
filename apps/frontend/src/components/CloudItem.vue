<template>
  <v-card
    class="ma-4"
    rounded="lg"
    variant="flat"
    border
  >
    <v-card-item>
      <v-card-title class="text-body-2 d-flex align-center">
        <v-icon
          color="#949cf7"
          icon="mdi-laptop"
          start
        ></v-icon>


        <span class="text-medium-emphasis font-weight-bold">Cloud 1</span>

        <v-spacer></v-spacer>

        <span class="text-medium-emphasis font-weight-bold">23/08/2023 - 9:00 PM</span>
      </v-card-title>

      <div class="py-2">
        <div class="text-h6">Live Q&A</div>

        <div class="font-weight-light text-medium-emphasis">
          Join the Vuetify team for a live Question and Answer session.
        </div>
      </div>
    </v-card-item>

    <v-divider></v-divider>

    <div class="pa-4 d-flex align-center">
      <v-icon
        color="disabled"
        icon="mdi-broadcast"
        start
      ></v-icon>

      <v-spacer></v-spacer>

      <v-btn
        border
        prepend-icon="mdi-remote-desktop"
        variant="text"
        class="mr-1"
      >
        Điều khiển
      </v-btn>

      <v-btn
        border
        prepend-icon="mdi-restart"
        variant="text"
        class="mr-1"
        color="orange"
      >
        Khởi động lại
      </v-btn>

      <v-btn
        border
        prepend-icon="mdi-power"
        variant="text"
        class="mr-1"
        color="orange"
      >
        Tắt
      </v-btn>

      <v-btn
        border
        prepend-icon="mdi-delete"
        variant="text"
        color="red"
      >
        Xóa
      </v-btn>
    </div>
  </v-card>
</template>