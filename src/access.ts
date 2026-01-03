import router from '@/router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'

// 是否为首次获取用户信息（防止重复请求）
let firstFetchLoginUser = true

// 路由白名单：无需登录/权限即可访问的页面
const WHITE_LIST = ['/login', '/403', '/404', '/']

/**
 * 路由前置守卫 - 权限控制
 * @param {RouteLocationNormalized} to 目标路由
 * @param {RouteLocationNormalized} from 来源路由
 * @param {Function} next 路由跳转函数
 */
router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser

  // 1. 白名单页面直接放行，无需权限校验
  if (WHITE_LIST.includes(to.path)) {
    next()
    return
  }

  try {
    // 2. 首次进入非白名单页面，获取用户信息（仅首次请求）
    if (firstFetchLoginUser) {
      await loginUserStore.fetchLoginUser()
      loginUser = loginUserStore.loginUser
      firstFetchLoginUser = false
    }

    // 3. 校验登录态：未登录则跳登录页
    if (!loginUser) {
      message.warning('请先登录后再访问')
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
      return
    }

    // 4. 校验管理员权限：访问/admin开头页面需admin角色
    if (to.fullPath.startsWith('/admin')) {
      if (loginUser.userRole !== 'admin') {
        message.error('您没有权限访问该页面')
        // 避免重复跳403：如果已经是403页面则不处理
        if (to.path !== '/403') {
          next('/403')
        } else {
          next(false) // 终止跳转
        }
        return
      }
    }

    // 5. 所有校验通过，正常放行
    next()
  } catch (error) {
    // 捕获用户信息请求异常，重置首次请求标识（允许重试）
    firstFetchLoginUser = true
    console.error('获取用户信息失败：', error)
    message.error('获取用户信息失败，请刷新页面重试')
    next('/login')
  }
})
