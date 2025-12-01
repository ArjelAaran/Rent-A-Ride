<template>
  <div class="booking-container">
    <h2>Book Car ID: {{ carId }}</h2>
    
    <div v-if="carDetails">
      <p class="car-info">{{ carDetails.make }} {{ carDetails.model }} - ₱{{ dailyRate.toFixed(2) }} / day</p>
    </div>
    <div v-else-if="loadingCarDetails" class="message">Loading car details...</div>
    <div v-else class="message error">Failed to load car details. Check GET /api/cars/:carId endpoint.</div>

    <form @submit.prevent="handleSubmit" class="booking-form">
      <div class="form-group">
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate" v-model="rentalData.startDate" required />
      </div>

      <div class="form-group">
        <label for="endDate">End Date:</label>
        <input type="date" id="endDate" v-model="rentalData.endDate" required />
      </div>

      <p v-if="totalCost > 0" class="total-cost">Total Estimated Cost: ₱{{ totalCost.toFixed(2) }}</p>

      <button type="submit" :disabled="loading || totalCost <= 0" class="submit-btn">
        {{ loading ? 'Booking...' : 'Confirm Rental' }}
      </button>

      <div v-if="message" :class="['message', isSuccess ? 'success' : 'error']">{{ message }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '../lib/apiClient';

const route = useRoute();
const router = useRouter();
const carId = ref(route.params.carId);
const carDetails = ref(null);
const loading = ref(false); // For form submission
const loadingCarDetails = ref(true); // For initial data fetch
const message = ref('');
const isSuccess = ref(false);

const rentalData = reactive({
    carId: carId.value,
    startDate: '',
    endDate: '',
    totalCost: 0,
});

const fetchCarDetails = async () => {
    loadingCarDetails.value = true;
    try {
        const response = await apiClient.get(`/cars/${carId.value}`); 
        carDetails.value = response.data;
    } catch (error) {
        console.error('Failed to fetch car details (Check GET /api/cars/:carId):', error);
    } finally {
        loadingCarDetails.value = false;
    }
};

const dailyRate = computed(() => carDetails.value ? parseFloat(carDetails.value.daily_rate) : 0);

const totalCost = computed(() => {
    if (dailyRate.value <= 0) {
        return 0;
    }
    
    const start = new Date(rentalData.startDate);
    const end = new Date(rentalData.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 0;
    }
    
    if (start >= end) {
        return 0;
    }
    
    const diffTime = end.getTime() - start.getTime(); 
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    return diffDays > 0 ? diffDays * dailyRate.value : 0;
});

const handleSubmit = async () => {
    rentalData.totalCost = totalCost.value;

    if (rentalData.totalCost <= 0) {
        message.value = 'Please select valid start and end dates (End date must be after Start date).';
        isSuccess.value = false;
        return;
    }
    
    // Ensure the token is present
    const token = localStorage.getItem('userToken');
    if (!token) {
        message.value = 'Authentication failed. Please log in again.';
        router.push('/login');
        return;
    }

    loading.value = true;
    message.value = '';

    try {
        // API call to POST /api/cars/rentals (The third required form submission)
        await apiClient.post('/cars/rentals', rentalData, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });

        message.value = 'Rental booked successfully!';
        isSuccess.value = true;
        
        setTimeout(() => router.push('/dashboard'), 2000); 

    } catch (err) {
        message.value = 'Booking failed. Check backend logs for validation errors.';
        isSuccess.value = false;
        console.error('Booking Error:', err.response ? err.response.data : err);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchCarDetails);
</script>

<style scoped>
.booking-container { max-width: 600px; margin: 3rem auto; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.booking-form { display: grid; gap: 1rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
.form-group input { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
.total-cost { font-size: 1.2rem; font-weight: bold; margin-top: 1rem; color: #0056b3; }
.submit-btn { padding: 1rem; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; transition: background 0.3s; }
.submit-btn:hover:not(:disabled) { background: #555; }
.submit-btn:disabled { background: #ccc; cursor: not-allowed; }
.message { padding: 1rem; margin-top: 1rem; border-radius: 4px; font-weight: bold; }
.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
.car-info { font-size: 1.1rem; color: #0056b3; margin-bottom: 1.5rem; }
</style>