<template>
  <div class="merchant-login-container">
    <div class="form-container">
      <h2 class="title">商家登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username" class="form-label">商家账号</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username"
            required
          />
        </div>
        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary btn-block">登录</button>
        <button type="button" class="btn btn-secondary btn-block" @click="$router.push('/mall')">
          返回商城
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { merchantApi } from '../api'

export default {
  name: 'MerchantLogin',
  setup() {
    const router = useRouter()
    const form = ref({
      username: '',
      password: ''
    })
    
    const handleLogin = async () => {
      try {
        const response = await merchantApi.login(
          form.value.username,
          form.value.password
        )
        
        if (response.data.success) {
          localStorage.setItem('merchantId', response.data.merchantId)
          localStorage.setItem('merchantName', response.data.merchantName)
          alert('登录成功')
          router.push('/merchant-dashboard')
        } else {
          alert('登录失败，账号或密码错误')
        }
      } catch (error) {
        console.error('登录请求出错:', error)
        alert('登录请求出现错误，请稍后重试')
      }
    }
    
    return {
      form,
      handleLogin
    }
  }
}
</script>

<style scoped>
.merchant-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.form-container {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
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
  background-color: #667eea;
  color: white;
}

.btn-primary:hover {
  background-color: #5568d3;
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

