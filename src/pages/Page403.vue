<template>
  <div class="page-403">
    <!-- 403核心内容区 -->
    <div class="content">
      <!-- 403图标/数字 -->
      <div class="error-code">403</div>
      <div class="error-desc">抱歉，您没有访问该页面的权限</div>
      <div class="error-tips">您可以返回首页继续操作，或联系管理员申请权限</div>
      <!-- 操作按钮 -->
      <div class="btn-group">
        <a-button type="primary" @click="goHome">返回首页</a-button>
        <a-button @click="goBack">返回上一页</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/')
}

// 返回上一页（兼容无历史记录的情况）
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    goHome()
  }
}
</script>

<style scoped>
.page-403 {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.content {
  text-align: center;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.error-code {
  font-size: 100px;
  font-weight: 700;
  color: #ff4d4f;
  margin-bottom: 20px;
}

.error-desc {
  font-size: 24px;
  color: #333;
  margin-bottom: 16px;
}

.error-tips {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>
