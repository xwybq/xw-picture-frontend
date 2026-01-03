<template>
  <div id="userLoginPage">
    <!-- 注册容器：卡片化 + 向上调整位置 -->
    <div class="login-card">
      <h2 class="title">xw云图库 - 用户注册</h2>
      <div class="desc">云图库，让您的图片更安全、更方便</div>
      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="handleSubmit"
        @finishFailed="handleSubmitFailed"
        class="login-form"
      >
        <a-form-item
          name="userAccount"
          :rules="[
            { required: true, message: '请输入账号!' },
            { min: 4, message: '账号长度不能小于4位' },
          ]"
        >
          <a-input
            v-model:value="formState.userAccount"
            placeholder="请输入账号"
            class="login-input"
            size="large"
          />
        </a-form-item>

        <a-form-item
          name="userPassword"
          :rules="[
            { required: true, message: '请输入密码!' },
            { min: 8, message: '密码长度不能小于8位' },
          ]"
        >
          <a-input-password
            v-model:value="formState.userPassword"
            placeholder="请输入密码"
            class="login-input"
            size="large"
          />
        </a-form-item>
        <a-form-item
          name="checkPassword"
          :rules="[
            { required: true, message: '请确认密码!' },
            { min: 8, message: '确认密码长度不能小于8位' },
          ]"
        >
          <a-input-password
            v-model:value="formState.checkPassword"
            placeholder="请确认密码"
            class="login-input"
            size="large"
          />
        </a-form-item>

        <div class="tips">
          已有账号？
          <RouterLink to="/user/login" class="register-link">去登录</RouterLink>
        </div>
        <a-form-item class="submit-btn-wrap">
          <a-button type="primary" html-type="submit" class="login-btn" size="large">
            注册
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { userLoginUsingPost, userRegisterUsingPost } from '@/api/userController.ts'
import router from '@/router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'

/**
 * 注册请求参数（保持原有逻辑不变）
 */
interface UserRegisterRequest {
  userAccount: string
  userPassword: string
  checkPassword: string
}

// 若项目中有全局API类型声明，可替换为 API.UserRegisterRequest
const formState = reactive<UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

const loginUserStore = useLoginUserStore()

/**
 * 注册提交处理（保持原有逻辑不变）
 */
const handleSubmit = async (values: any) => {
  try {
    // 校验确认密码是否与密码一致
    if (values.userPassword !== values.checkPassword) {
      message.error('两次输入的密码不一致')
      return
    }
    const res = await userRegisterUsingPost(values)
    // 注册成功后，自动登录
    if (res.data.code === 0 && res.data.data) {
      await loginUserStore.fetchLoginUser()
      message.success('注册成功')
      await router.push({
        path: '/user/login',
        replace: true,
      })
    } else {
      message.error('注册失败，' + res.data.message)
    }
  } catch (e) {
    message.error('注册失败，' + e)
  }
}

const handleSubmitFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
</script>

<style scoped>
/* 全局页面背景：替换为图片 + 全屏覆盖 + 调整居中方式（让卡片上移） */
#userLoginPage {
  min-height: 100vh;
  /* 1. 替换为背景图片（请替换成你自己的图片路径） */
  background-image: url('@/assets/img.png'); /* 推荐放在src/assets目录下 */
  /* 背景图适配：覆盖全屏 + 居中 + 不重复 */
  background-size: cover; /* 让图片覆盖整个容器，保持比例 */
  background-position: center; /* 图片居中显示 */
  background-repeat: no-repeat; /* 禁止图片重复 */
  background-attachment: fixed; /* 固定背景，滚动时不移动 */
  /* 2. 调整布局，让卡片向上移动（核心：把垂直居中改为flex-start，配合padding-top控制上移幅度） */
  display: flex;
  align-items: flex-start; /* 取消垂直居中，改为顶部对齐 */
  justify-content: center;
  padding: 100px 20px 20px; /* 顶部padding设为80px（可调整），控制卡片上移幅度 */
  box-sizing: border-box;
}

/* 注册卡片：白色背景 + 圆角 + 阴影 + 内边距（新增轻微上移优化） */
.login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 40px 32px;
  box-sizing: border-box;
  /* 可选：额外微调上移（如果padding-top不够，可加这个） */
  /* transform: translateY(-10px); */
}

/* 标题样式：加粗 + 更大字号 + 居中 */
.title {
  text-align: center;
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

/* 描述文字：更柔和的颜色 + 居中 + 间距调整 */
.desc {
  text-align: center;
  margin-bottom: 32px;
  color: #666;
  font-size: 14px;
}

/* 表单整体间距 */
.login-form {
  margin-top: 8px;
}

/* 输入框样式：圆角 + 边框优化 + 间距 */
.login-input {
  border-radius: 8px;
  margin-bottom: 4px;
  --antd-input-border-color: #e5e7eb;
  --antd-input-hover-border-color: #667eea;
  --antd-input-focus-border-color: #667eea;
}

/* 提示文字：间距 + 颜色优化 */
.tips {
  text-align: right;
  margin-bottom: 24px;
  color: #666;
  font-size: 14px;
}

/* 注册链接：颜色 + hover效果 */
.register-link {
  color: #667eea;
  text-decoration: none;
  margin-left: 4px;
}

.register-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 提交按钮容器：间距 */
.submit-btn-wrap {
  margin-bottom: 0;
}

/* 注册按钮：渐变背景 + 圆角 + hover效果 + 宽度100% */
.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a6edb 0%, #6b4191 100%);
}

/* 适配小屏幕（如手机） */
@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
  }

  .title {
    font-size: 20px;
  }
  /* 移动端调整顶部padding，避免卡片太靠上 */
  #userLoginPage {
    padding-top: 60px;
  }
}
</style>
