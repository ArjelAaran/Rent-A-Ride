<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)

const checkAuthStatus = () => {
    const token = localStorage.getItem('userToken')
    isLoggedIn.value = !!token
}

const handleLogout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('user')
    isLoggedIn.value = false 
    router.push('/login')
}

onMounted(() => {
    checkAuthStatus()
})
router.afterEach(() => {
    checkAuthStatus();
})
</script>

<template>
  <div id="app-wrapper">
    <header>
      <nav class="navbar">
        <RouterLink to="/" class="logo">RentARide</RouterLink>
        <div class="nav-links">
          <template v-if="isLoggedIn">
            <RouterLink to="/" class="nav-item">Home</RouterLink>
            <RouterLink to="/about" class="nav-item">About Us</RouterLink>
            <RouterLink to="/contact" class="nav-item">Contact Us</RouterLink>
            <RouterLink to="/dashboard" class="nav-item">Profile</RouterLink>
            <RouterLink to="/dashboard" class="nav-item">Dashboard</RouterLink>
            <RouterLink to="/profile" class="nav-item">Edit Profile</RouterLink>
            <button @click="handleLogout" class="nav-btn logout-btn">Log out</button>
          </template>
          <template v-else>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about" class="nav-item">About Us</RouterLink>
            <RouterLink to="/contact" class="nav-item">Contact Us</RouterLink>
            <RouterLink to="/login" class="nav-item">Login</RouterLink>
            <RouterLink to="/register" class="nav-btn">Register</RouterLink>
          </template>
        </div>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }


.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo { font-size: 1.5rem; font-weight: 800; color: #0056b3; letter-spacing: -1px; text-decoration: none; }

.nav-links { display: flex; align-items: center; gap: 20px; }
.nav-links a { text-decoration: none; color: #444; font-weight: 500; }
.nav-links a:hover { color: #0056b3; }

.nav-btn {
  background-color: #0056b3;
  color: white !important;
  padding: 8px 20px;
  border-radius: 4px;
  transition: background 0.2s;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
}
.nav-btn:hover { background-color: #004494; }

.logout-btn {
  background-color: #dc2626;
}
.logout-btn:hover {
  background-color: #b91c1c;
}
</style>