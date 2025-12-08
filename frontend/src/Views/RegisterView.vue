<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import apiClient from '../lib/apiClient' 

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
    if (password.value !== confirmPassword.value) {
        errorMessage.value = "Passwords do not match"
        return
    }

    loading.value = true
    errorMessage.value = ''

    try {
        const response = await apiClient.post('/auth/register', {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value,
        })

        localStorage.setItem('userToken', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        router.push('/dashboard')

    } catch (error) {
        console.error('Registration error:', error.response ? error.response.data : error.message)
        errorMessage.value = error.response?.data?.message || 'Registration failed. Please try again.'
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <div class="register-container">
    <div class="header">
      <div class="icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17h2"/><path d="M15 17h2"/></svg>
      </div>
      <h1>Create an Account</h1>
      <p class="subtitle">Join us and start your journey on the road.</p>
    </div>

    <div class="form-card">
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <form @submit.prevent="handleRegister">
        <div class="name-row">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" v-model="firstName" placeholder="John" required />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" v-model="lastName" placeholder="Doe" required />
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email address</label>
          <input type="email" id="email" v-model="email" placeholder="you@example.com" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="........" required />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="........" required />
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Signing up...' : 'Sign Up' }}
        </button>
      </form>
    </div>

    <p class="footer-text">
      Already have an account? <RouterLink to="/login" class="login-link">Log in</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  background-color: #fff;
  font-family: sans-serif;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  background-color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #4b5563;
}

h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}

.form-card {
  background-color: #f9fafb;
  padding: 2.5rem;
  border-radius: 8px;
  width: 100%;
  max-width: 480px;
}

.name-row {
  display: flex;
  gap: 1rem;
}

.name-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  background-color: #fff;
}

input:focus {
  border-color: #111827;
}

input::placeholder {
  color: #9ca3af;
}

.submit-btn {
  width: 100%;
  padding: 0.875rem;
  background-color: #111827;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
}

.submit-btn:hover {
  background-color: #000;
}

.footer-text {
  margin-top: 2rem;
  color: #6b7280;
  font-size: 0.95rem;
}

.login-link {
  color: #111827;
  font-weight: 600;
  text-decoration: none;
}

.login-link:hover {
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