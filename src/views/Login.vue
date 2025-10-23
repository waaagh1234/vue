<template>
  <div class="login-container">
    <!-- 主页面 -->
    <div v-if="currentPage === 'main'" class="form-container">
      <h2 class="title">欢迎使用</h2>
      <button class="btn btn-login" @click="currentPage = 'login'">登录界面</button>
      <button class="btn btn-register" @click="currentPage = 'register'">注册界面</button>
      <router-link to="/reset-password" class="forgot-password">忘记密码?</router-link>
    </div>

    <!-- 登录页面 -->
    <div v-if="currentPage === 'login'" class="form-container">
      <h2 class="title">登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="loginUsername" class="form-label">用户名</label>
          <input 
            type="text" 
            id="loginUsername" 
            v-model="loginForm.username"
            required
          />
        </div>
        <div class="form-group">
          <label for="loginPassword" class="form-label">密码</label>
          <input 
            type="password" 
            id="loginPassword" 
            v-model="loginForm.password"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary btn-block">登录</button>
        <button type="button" class="btn btn-secondary btn-block" @click="currentPage = 'main'">返回</button>
      </form>
    </div>

    <!-- 注册页面 -->
    <div v-if="currentPage === 'register'" class="form-container">
      <h2 class="title">注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="registerUsername" class="form-label">用户名</label>
          <input 
            type="text" 
            id="registerUsername" 
            v-model="registerForm.username"
            required
          />
        </div>
        <div class="form-group">
          <label for="registerPassword" class="form-label">密码</label>
          <input 
            type="password" 
            id="registerPassword" 
            v-model="registerForm.password"
            required
          />
        </div>
        <div class="form-group">
          <label for="registerEmail" class="form-label">邮箱</label>
          <input 
            type="email" 
            id="registerEmail" 
            v-model="registerForm.email"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary btn-block">注册</button>
        <button type="button" class="btn btn-secondary btn-block" @click="currentPage = 'main'">返回</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '../api'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const currentPage = ref('main')
    
    const loginForm = ref({
      username: '',
      password: ''
    })
    
    const registerForm = ref({
      username: '',
      password: '',
      email: ''
    })
    
    const handleLogin = async () => {
      try {
        const response = await userApi.login(
          loginForm.value.username,
          loginForm.value.password
        )
        
        if (response.data.success) {
          localStorage.setItem('userId', response.data.userId)
          localStorage.setItem('username', response.data.username)
          alert('登录成功')
          router.push('/mall')
        } else {
          alert('登录失败，账号或密码错误')
        }
      } catch (error) {
        console.error('登录请求出错:', error)
        alert('登录请求出现错误，请稍后重试')
      }
    }
    
    const handleRegister = async () => {
      try {
        const response = await userApi.register(
          registerForm.value.username,
          registerForm.value.password,
          registerForm.value.email
        )
        
        if (response.data.success) {
          alert('注册成功，请登录')
          currentPage.value = 'login'
          registerForm.value = {
            username: '',
            password: '',
            email: ''
          }
        } else {
          alert(response.data.message || '注册失败')
        }
      } catch (error) {
        console.error('注册请求出错:', error)
        alert('注册请求出现错误，请稍后重试')
      }
    }
    
    return {
      currentPage,
      loginForm,
      registerForm,
      handleLogin,
      handleRegister
    }
  }
}
</script>

<style scoped>
.login-container {
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

.btn-login {
  background-color: #3490dc;
  color: white;
}

.btn-login:hover {
  background-color: #2779bd;
}

.btn-register {
  background-color: #28a745;
  color: white;
}

.btn-register:hover {
  background-color: #218838;
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

.forgot-password {
  display: block;
  text-align: center;
  margin-top: 15px;
  color: #3490dc;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}
</style>

