<template>
  <div id="app">
    <BasicLayout></BasicLayout>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from './layouts/BasicLayout.vue'
import { healthUsingGet } from '@/api/mainController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'



healthUsingGet().then((res) => {
  console.log(res)
})
</script>

<style scoped></style>
