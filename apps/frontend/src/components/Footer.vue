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
  margin-top: 160px;
  padding: 16px 0;
  color: #fff;
  background-color: var(--header-background);
  position: relative;

  &::after {
    content: '';
    display: block;
    position: absolute;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDBweCIgdmlld0JveD0iMCAwIDEyODAgMTQwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik0wIDUxLjc2YzM2LjIxLTIuMjUgNzcuNTctMy41OCAxMjYuNDItMy41OCAzMjAgMCAzMjAgNTcgNjQwIDU3IDI3MS4xNSAwIDMxMi41OC00MC45MSA1MTMuNTgtNTMuNFYwSDB6IiBmaWxsLW9wYWNpdHk9Ii4zIi8+PHBhdGggZD0iTTAgMjQuMzFjNDMuNDYtNS42OSA5NC41Ni05LjI1IDE1OC40Mi05LjI1IDMyMCAwIDMyMCA4OS4yNCA2NDAgODkuMjQgMjU2LjEzIDAgMzA3LjI4LTU3LjE2IDQ4MS41OC04MFYwSDB6IiBmaWxsLW9wYWNpdHk9Ii41Ii8+PHBhdGggZD0iTTAgMHYzLjRDMjguMiAxLjYgNTkuNC41OSA5NC40Mi41OWMzMjAgMCAzMjAgODQuMyA2NDAgODQuMyAyODUgMCAzMTYuMTctNjYuODUgNTQ1LjU4LTgxLjQ5VjB6Ii8+PC9nPjwvc3ZnPg==');
    background-color: var(--header-background);
    mix-blend-mode: multiply;
    width: 100vw;
    height: 80px;
    top: -80px;
  }
}
</style>

<script setup lang="ts">
import moment from 'moment';

const buildTime = moment(+BUILD_TIME).format('DD/MM/YYYY HH:mm:ss');
</script>