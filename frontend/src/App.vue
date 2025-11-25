<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="navbar">
      <div class="logo">RentARide</div>
      <div class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login" class="nav-item">Login</RouterLink>
        <RouterLink to="/register" class="nav-btn">Register</RouterLink>
      </div>
    </nav>
  </header>

  <RouterView />
</template>

<style>
/* GLOBAL STYLES */
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

.logo { font-size: 1.5rem; font-weight: 800; color: #0056b3; letter-spacing: -1px; }

.nav-links { display: flex; align-items: center; gap: 20px; }
.nav-links a { text-decoration: none; color: #444; font-weight: 500; }
.nav-links a:hover { color: #0056b3; }

.nav-btn {
  background-color: #0056b3;
  color: white !important;
  padding: 8px 20px;
  border-radius: 4px;
  transition: background 0.2s;
}
.nav-btn:hover { background-color: #004494; }
</style>