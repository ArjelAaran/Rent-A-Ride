<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'
import apiClient from '../lib/apiClient'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
    loading.value = true
    errorMessage.value = ''
    
    try {
        const response = await apiClient.post('/auth/login', {
            email: email.value,
            password: password.value,
        })

        localStorage.setItem('userToken', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        router.push('/dashboard')
    } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message)
        errorMessage.value = error.response?.data?.message || 'Login failed. Check your email and password.'
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      
      <div class="header">
        <div class="icon-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
        <h1>Welcome Back</h1>
        <p class="subtitle">Log in to continue your journey.</p>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email address</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="you@example.com" 
            required
          />
        </div>

        <div class="form-group">
          <div class="label-row">
            <label for="password">Password</label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="••••••••" 
            required
          />
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Log In' }}
        </button>
      </form>
    </div>

    <div class="footer-text">
      Don't have an account? <RouterLink to="/register" class="signup-link">Sign up</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fcfcfc; 
}

.login-card {
  background: #f8f9fa; 
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.icon-circle {
  width: 48px;
  height: 48px;
  background-color: #eef2f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

/* Form Styling */
.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.label-row label {
  margin-bottom: 0;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  background-color: white;
}

input:focus {
  border-color: #94a3b8;
}

input::placeholder {
  color: #cbd5e1;
}

.forgot-link {
  font-size: 0.85rem;
  color: #111;
  text-decoration: none;
  font-weight: 600;
}

/* Button Styling */
.login-btn {
  width: 100%;
  background-color: #1a1a1a; 
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
}

.login-btn:hover {
  background-color: #333;
}

/* Footer Styling */
.footer-text {
  margin-top: 24px;
  color: #64748b;
  font-size: 0.95rem;
}

.signup-link {
  color: #111;
  font-weight: 700;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}

.error-message {
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
}
</style>