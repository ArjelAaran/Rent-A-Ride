<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

const router = useRouter()
const user = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { data: { user: authUser }, error } = await supabase.auth.getUser()
    if (error) throw error
    
    if (authUser) {
      user.value = authUser
      // You could fetch more user profile data from your 'users' table here if needed
    } else {
      router.push('/login')
    }
  } catch (error) {
    console.error('Error fetching user:', error.message)
    router.push('/login')
  } finally {
    loading.value = false
  }
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<template>
  <div class="dashboard-container">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else class="content">
      <header class="dashboard-header">
        <h1>Customer Dashboard</h1>
        <button @click="handleLogout" class="logout-btn">Log Out</button>
      </header>
      
      <main>
        <div class="welcome-card">
          <h2>Welcome back!</h2>
          <p>You are logged in as: {{ user?.email }}</p>
        </div>
        
        <!-- Add more dashboard content here -->
        <div class="dashboard-grid">
          <div class="card">
            <h3>My Rentals</h3>
            <p>View your active and past rentals.</p>
          </div>
          <div class="card">
            <h3>Available Cars</h3>
            <p>Browse cars available for rent.</p>
          </div>
          <div class="card">
            <h3>Profile Settings</h3>
            <p>Update your personal information.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.welcome-card {
  background-color: #f3f4f6;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.card {
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
