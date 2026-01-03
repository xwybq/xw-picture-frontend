<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img src="../assets/logo.png" alt="logo" class="logo" />
            <!-- 单标签加/闭合 -->
            <div class="title">xw云图库</div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        >
        </a-menu>
        <!-- 补充a-menu的结束标签 -->
      </a-col>

      <a-col flex="150px">
        <div class="user-login-status">
          <!-- 用户名+头像下拉区域 -->
          <div v-if="loginUserStore.loginUser.id" class="user-name">
            <a-dropdown trigger="hover">
              <span class="user-info-wrap">
                <!-- 关键修复：a-avatar单标签加/自闭合 -->
                <a-avatar
                  :src="loginUserStore.loginUser.userAvatar"
                  class="user-avatar"
                  fallback="U"
                />
                <span class="user-name-text">
                  {{ loginUserStore.loginUser.userName || '无名' }}
                </span>
              </span>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="doLogout">
                    <LogoutOutlined style="margin-right: 8px" />退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <a-button type="primary" href="/user/login" v-else> 登录 </a-button>
          <!-- 补充a-button的结束标签 -->
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { h, ref, onMounted, computed } from 'vue'
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userLogoutUsingPost } from '@/api/userController.ts'

/**
 * 原始菜单项配置（包含所有可能的路由）
 */
const originalItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/admin/userManage',
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: 'others',
    label: h('a', { href: 'https://xwybq.top', target: '_blank' }, '我的博客'),
    title: '我的博客',
  },
]

//过滤出当前用户有权限访问的菜单项
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    // 管理员菜单仅对admin角色可见
    if (menu?.key?.startsWith('/admin')) {
      const loginUser = loginUserStore.loginUser
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false
      }
    }
    return true
  })
}

// 计算属性：根据登录用户角色过滤菜单项
const items = computed(() => {
  return filterMenus(originalItems)
})



const loginUserStore = useLoginUserStore()
const router = useRouter()

// 挂载后主动获取登录用户信息，确保数据加载
onMounted(() => {
  loginUserStore.fetchLoginUser()
  // 调试：打印用户数据，确认userName是否存在
  console.log('登录用户数据：', loginUserStore.loginUser.userName)
})

const doMenuClick = (key: any) => {
  router.push({ path: key.key })
}

const doLogout = async () => {
  try {
    const res = await userLogoutUsingPost()
    if (res.data.code === 0) {
      loginUserStore.setLoginUser({ id: 0, userName: '未登录' }) // 重置id，确保登出后显示登录按钮
      message.success('退出登录成功')
      await router.push('/user/login')
    } else {
      message.error('退出登录失败：' + res.data.message)
    }
  } catch (err) {
    message.error('退出登录请求失败，请重试')
    console.error('登出异常：', err)
  }
}

const current = ref<string[]>([])
router.afterEach((to) => {
  current.value = [to.path]
})
</script>

<style scoped>
#globalHeader {
  padding: 0 20px;
  line-height: 64px;
  border-bottom: 1px solid #e8e8e8;
}
#globalHeader .title-bar {
  display: flex;
  align-items: center;
  height: 64px;
}
.title {
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin-left: 10px;
}
.logo {
  height: 48px;
}

.user-login-status {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
}

/* 核心修改：重构用户名样式，适配头像+文字布局 */
.user-name {
  display: inline-flex; /* 改为flex，让头像和文字水平对齐 */
  align-items: center; /* 垂直居中 */
  padding: 4px 12px; /* 调整内边距，适配头像 */
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
  background-color: #f5f7ff;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 120px; /* 加宽最大宽度，避免文字截断 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 头像样式：调整大小+间距 */
.user-avatar {
  width: 24px;
  height: 24px;
  margin-right: 8px; /* 头像和文字的间距 */
}

/* 用户名文字样式：单独控制 */
.user-name-text {
  color: inherit; /* 继承父级颜色 */
  line-height: 1; /* 消除行高影响 */
}

/* hover效果优化 */
.user-name:hover {
  background-color: #e6e9ff;
  color: #764ba2;
  transform: scale(1.02);
}

/* 登录按钮样式 */
.user-login-status .ant-btn {
  border-radius: 20px;
  padding: 4px 16px;
  background: #667eea;
  border-color: #667eea;
}
.user-login-status .ant-btn:hover {
  background: #764ba2;
  border-color: #764ba2;
}
</style>
