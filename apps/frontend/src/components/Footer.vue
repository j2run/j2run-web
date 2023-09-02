<template>
  <div class="footer">
    <v-container>
      <v-row justify="space-around">
        <v-col cols="12" :md="6">
          © Copyright j2run.com. All Rights Reserved 
        </v-col>
        <v-col cols="12" :md="6" class="text-caption text-right">
          version: {{ buildTime }}
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  margin-top: 60px;
  padding: 16px 0;
  color: #fff;
  background-color: var(--header-background);
}
</style>

<script setup lang="ts">
import moment from 'moment';

const buildTime = moment(+BUILD_TIME).format('DD/MM/YYYY HH:mm:ss');
</script>