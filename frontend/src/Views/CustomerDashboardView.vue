<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../lib/apiClient' 

const router = useRouter()
const user = ref(null)
const rentals = ref([]) 
const loading = ref(true)
const rentalsLoading = ref(true)

const fetchRentals = async (userId) => {
    try {
        const response = await apiClient.get(`/cars/rentals/${userId}`);
        rentals.value = response.data;
    } catch (error) {
        console.error('Error fetching rentals:', error.response ? error.response.data : error.message);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
             handleLogout(); 
        }
    } finally {
        rentalsLoading.value = false;
    }
}

onMounted(async () => {
    const userData = localStorage.getItem('user');

    if (userData) {
        try {
            user.value = JSON.parse(userData);
            await fetchRentals(user.value.id);

        } catch (e) {
            console.error('Invalid user data in storage:', e);
            handleLogout();
        }
    } else {
        router.push('/login'); 
    }
    loading.value = false;
})

const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    router.push('/login')
}
</script>

<template>
  <div class="card full-width">
            <h3>My Rentals (View 2/2 for database data)</h3>
            <div v-if="rentalsLoading">Loading rentals...</div>
            <div v-else-if="rentals.length === 0">You have no recorded rentals.</div>
            <table v-else class="rentals-table">
                <thead>
                    <tr>
                        <th>Car</th>
                        <th>Dates</th>
                        <th>Total Cost</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="rental in rentals" :key="rental.rental_id">
                        <td>{{ rental.make }} {{ rental.model }} ({{ rental.year }})</td>
                        <td>{{ rental.start_date }} to {{ rental.end_date }}</td>
                        <td>₱{{ rental.total_cost.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</td>
                        <td><span :class="['status-' + rental.status]">{{ rental.status }}</span></td>
                    </tr>
                </tbody>
            </table>
          </div>
  </template>

<style scoped>
.full-width {
    grid-column: 1 / -1;
}
.rentals-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}
.rentals-table th, .rentals-table td {
    padding: 12px 15px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
}
.rentals-table th {
    background-color: #f3f4f6;
    font-weight: 600;
    color: #333;
}
.status-active { color: #059669; font-weight: bold; }
.status-pending { color: #f59e0b; }
.status-completed { color: #6b7280; }
.status-cancelled { color: #dc2626; }
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
