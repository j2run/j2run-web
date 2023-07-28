<template>
  <div class="text-center">
    <v-menu
      v-model="state.menu"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          border
          :prepend-icon="gp.icon"
          variant="text"
          class="mr-1"
          color="orange"
        >
          {{gp.label}}
        </v-btn>
      </template>

      <v-card min-width="300">
        <v-card-text class="text-subtitle-1">{{ gp.message }}</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            variant="text"
            @click="state.menu = false"
          >
            Không
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="state.menu = false"
          >
            Có
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const gp = defineProps(['icon', 'label', 'message']);


const state = reactive({
  menu: false,
});
</script>