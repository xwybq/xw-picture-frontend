<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img src="../assets/logo.png" alt="logo" class="logo" />
            <div class="title">xw云图库</div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <!--        菜单-->
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
      </a-col>

      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            {{
              loginUserStore.loginUser.userName.length > 0
                ? loginUserStore.loginUser.userName
                : '无名'
            }}
          </div>
          <a-button type="primary" href="/user/login" v-if="!loginUserStore.loginUser.id">
            登录
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { h, ref } from 'vue'
import { HomeOutlined } from '@ant-design/icons-vue'
import { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import * as path from 'node:path'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const items = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/about',
    label: '关于',
    title: '关于',
  },
  {
    key: 'others',
    label: h('a', { href: 'https://xwybq.top', target: '_blank' }, '我的博客'),
    title: '我的博客',
  },
])
const router = useRouter()
const doMenuClick = (key: string) => {
  router.push({
    path: '/about',
  })
}
const current = ref<string[]>([])
router.afterEach((to, from, next) => {
  current.value = [to.path]
})
const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()
</script>
<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}
.title {
  color: black;
  font-size: 18px;
  margin-left: 10px;
}
.logo {
  height: 48px;
}
</style>
