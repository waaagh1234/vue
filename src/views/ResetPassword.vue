<template>
  <div class="reset-password-container">
    <div class="form-container">
      <h2 class="title">重置密码</h2>
      <form @submit.prevent="handleResetPassword">
        <div class="form-group">
          <label for="username" class="form-label">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username"
            required
          />
        </div>
        <div class="form-group">
          <label for="email" class="form-label">邮箱</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email"
            required
          />
        </div>
        <div class="form-group">
          <label for="newPassword" class="form-label">新密码</label>
          <input 
            type="password" 
            id="newPassword" 
            v-model="form.newPassword"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary btn-block">重置密码</button>
        <button type="button" class="btn btn-secondary btn-block" @click="$router.push('/login')">
          返回登录
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '../api'

export default {
  name: 'ResetPassword',
  setup() {
    const router = useRouter()
    const form = ref({
      username: '',
      email: '',
      newPassword: ''
    })
    
    const handleResetPassword = async () => {
      try {
        const response = await userApi.resetPassword(
          form.value.username,
          form.value.email,
          form.value.newPassword
        )
        
        if (response.data.success) {
          alert('密码重置成功，请登录')
          router.push('/login')
        } else {
          alert(response.data.message || '密码重置失败')
        }
      } catch (error) {
        console.error('重置密码请求出错:', error)
        alert('重置密码请求出现错误，请稍后重试')
      }
    }
    
    return {
      form,
      handleResetPassword
    }
  }
}
</script>

<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
}

.form-container {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  color: #374151;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.btn {
  width: 100%;
  margin: 10px 0;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #ff0036;
  color: white;
}

.btn-primary:hover {
  background-color: #e6002f;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-block {
  width: 100%;
}
</style>

