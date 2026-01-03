import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet } from '@/api/userController.ts'
import { message } from 'ant-design-vue' // 可选：用于提示错误

export const useLoginUserStore = defineStore('loginUser', () => {
  // 1. 修复：初始状态补充id字段，明确未登录标识（id=0表示未登录）
  const loginUser = ref<API.LoginUserVO>({
    id: 0, // 核心：添加id字段，0=未登录，>0=已登录
    userName: '未登录',
    userAvatar: '', // 可选：补充常用字段，避免后续取值报错
  })

  // 2. 修复：添加try/catch异常处理，完善状态更新逻辑
  async function fetchLoginUser() {
    try {
      const res = await getLoginUserUsingGet()
      // 情况1：接口成功且有数据 → 更新为登录用户信息
      if (res.data.code === 0 && res.data.data) {
        // 合并数据，避免覆盖默认字段（比如data缺少userAvatar时保留空值）
        loginUser.value = { ...loginUser.value, ...res.data.data }
        console.log('接口返回的用户信息：', res.data.data) // 调试：确认接口返回的userName
      }
      // 情况2：接口成功但无数据 → 重置为未登录
      else if (res.data.code === 0 && !res.data.data) {
        resetLoginUser()
      }
      // 情况3：接口返回失败（比如未登录）→ 重置为未登录
      else {
        resetLoginUser()
        message.warning('未检测到登录状态，请重新登录') // 可选：提示用户
      }
    } catch (err) {
      // 情况4：接口报错（网络/后端问题）→ 重置+提示错误
      resetLoginUser()
      console.error('获取登录用户信息失败：', err)
      message.error('获取用户信息失败，请刷新页面重试')
    }
  }

  // 新增：重置登录状态的通用方法（避免重复代码）
  function resetLoginUser() {
    loginUser.value = {
      id: 0,
      userName: '未登录',
      userAvatar: '',
    }
  }

  // 3. 修复：setLoginUser改为合并数据，避免丢失字段
  function setLoginUser(newLoginUser: Partial<API.LoginUserVO>) {
    loginUser.value = { ...loginUser.value, ...newLoginUser }
  }

  return { loginUser, fetchLoginUser, setLoginUser, resetLoginUser }
})
