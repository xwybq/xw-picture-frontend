<template>
  <div id="basicLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader/>
      </a-layout-header>
      <a-layout-content class="content">
      <router-view/>
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://xwybq.top" target="_blank">我的个人博客</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<style scoped>
#basicLayout .footer {
  background-color: white;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
#basicLayout .content{
 padding: 20px;
  background: linear-gradient(to right ,white,#fff);
margin-bottom: 28px;
  padding-inline: 20px;
}

#basicLayout .header{
  background: white;
  color: unset;
  margin-bottom: 16px;

}
</style>
