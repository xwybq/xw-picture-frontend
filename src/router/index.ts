import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: () => import('../pages/user/UserLoginPage.vue'),
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: () => import('../pages/user/UserRegisterPage.vue'),
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: () => import('../pages/admin/UserManagePage.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../pages/AboutPage.vue'),
    },
    {
      path: '/403',
      name: 'Page403',
      component: () => import('../pages/Page403.vue'),
      meta: {
        title: '无权限访问', // 页面标题
      },
    },
    // 可选：配置404页面（兜底）
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'Page404',
    //   component: () => import('@/views/404.vue'),
    //   meta: {
    //     title: '页面不存在',
    //   },
    // },
  ],
})

export default router
