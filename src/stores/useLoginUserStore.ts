import { ref} from 'vue'
import { defineStore } from 'pinia'

export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<any>({
    userName: '未登录',
  })

  async function fetchLoginUser() {
    // const res = await getCurrentUser()
    // if (res.data.code === 0 && res.data.data) {
    //   loginUser.value = res.data.data
    // }
    // setTimeout(() => {
    //   loginUser.value = {
    //     id: 1,
    //     userName: 'xw',
    //   }
    // }, 3000)
  }

  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser
  }
  return { loginUser, fetchLoginUser, setLoginUser }
})
