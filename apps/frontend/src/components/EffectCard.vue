<template>
  <div class="effect-card">
    <span class="r"></span>
    <span class="r s"></span>
    <span class="r s"></span>
    <span class="r"></span>
  </div>
</template>

<style lang="scss" scoped>
.effect-card {
  .r {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%; 
    &:nth-child(odd) {
      animation: floating 7s infinite;
    }
    &:nth-child(even) {
      animation: floating 9s infinite;
    }
    &:first-child {
      top: -100px;
      right: -100px;
      background: linear-gradient(-135deg,#1de9b6 0%,#1dc4e9 100%);
    }
    &:last-child {
      left: -100px;
      bottom: -100px;
      background: linear-gradient(-135deg,#899FD4 0%,#A389D4 100%);
    }
  }

  .r.s {
    width: 20px;
    height: 20px;

    &:nth-child(2) {
      top: 150px;
      right: -150px;
      background: #04a9f5;
    }

    &:nth-child(3) {
      left: -150px;
      bottom: 150px;
      background: #1de9b6;
    }
  }
}

@keyframes floating {
  0% {
    transform: rotate(0deg) translate(-10px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translate(-10px) rotate(-360deg);
  }
}
</style>

<script setup lang="ts">


</script>