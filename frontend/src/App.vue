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
            
            <RouterLink to="/dashboard" class="nav-item">Dashboard</RouterLink>
            <RouterLink to="/profile" class="nav-item">Edit Profile</RouterLink>
            
            <button @click="handleLogout" class="nav-btn logout-btn">Log out</button>
          </template>

          <template v-else>
            <RouterLink to="/" class="nav-item">Home</RouterLink>
            <RouterLink to="/about" class="nav-item">About Us</RouterLink>
            <RouterLink to="/contact" class="nav-item">Contact Us</RouterLink>
            <RouterLink to="/login" class="nav-item">Login</RouterLink>
            <RouterLink to="/register" class="nav-btn">Register</RouterLink>
          </template>

        </div>
      </nav>
    </header>

    <div class="main-content">
        <RouterView />
    </div>

    <footer class="app-footer">
        <div class="footer-content">
            <p>&copy; 2025 RentARide Inc. All rights reserved.</p>
            <div class="footer-links">
                <RouterLink to="/terms">Terms & Conditions</RouterLink>
                <RouterLink to="/faq">FAQs</RouterLink>
                <RouterLink to="/contact">Contact Support</RouterLink>
            </div>
        </div>
    </footer>
    
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

#app-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh; 
}

.main-content {
    flex: 1; 
}

.app-footer {
    background-color: #1f2937;
    color: white;
    padding: 2rem 0;
    margin-top: auto;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.footer-links {
    display: flex;
    gap: 20px;
}

.footer-links a {
    color: #9ca3af;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
}

.footer-links a:hover {
    color: white;
}
</style>