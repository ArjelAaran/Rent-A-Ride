<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import apiClient from '../lib/apiClient';

const route = useRoute();
const rental = ref(null);
const loading = ref(true);
const error = ref('');

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};

onMounted(async () => {
    const rentalId = route.params.id;
    try {
        const response = await apiClient.get(`/cars/rental/${rentalId}`);
        rental.value = response.data;
    } catch (err) {
        console.error(err);
        error.value = "Could not load booking details. But don't worry, your booking was saved.";
    } finally {
        loading.value = false;
    }
});
</script>

<template>
  <div class="success-container">
    <div class="card">
        <div class="icon-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        
        <h1>Booking Confirmed!</h1>
        <p class="subtitle">Thank you for choosing Rent-A-Ride. Your vehicle is reserved.</p>

        <div v-if="loading" class="loading">Loading details...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        
        <div v-else class="details-box">
            <div class="car-summary">
                <img :src="rental.image_url" alt="Car" v-if="rental.image_url" />
                <div>
                    <h3>{{ rental.make }} {{ rental.model }}</h3>
                    <p class="year">{{ rental.year }}</p>
                </div>
            </div>

            <div class="info-grid">
                <div class="info-item">
                    <span class="label">Rental ID</span>
                    <span class="value">#{{ rental.rental_id }}</span>
                </div>
                <div class="info-item">
                    <span class="label">Pick-up Date</span>
                    <span class="value">{{ formatDate(rental.start_date) }}</span>
                </div>
                <div class="info-item">
                    <span class="label">Return Date</span>
                    <span class="value">{{ formatDate(rental.end_date) }}</span>
                </div>
                <div class="info-item">
                    <span class="label">Total Cost</span>
                    <span class="value cost">₱{{ rental.total_cost.toLocaleString() }}</span>
                </div>
                <div class="info-item">
                    <span class="label">Status</span>
                    <span class="status-badge">{{ rental.status }}</span>
                </div>
            </div>
        </div>

        <div class="instructions">
            <h4>Next Steps</h4>
            <ul>
                <li>Please arrive at our office on the pick-up date.</li>
                <li>Bring your valid <strong>Driver's License</strong> and a secondary ID.</li>
                <li>Payment will be finalized at the counter.</li>
            </ul>
        </div>

        <div class="actions">
            <RouterLink to="/dashboard" class="btn primary">View My Bookings</RouterLink>
            <RouterLink to="/" class="btn secondary">Back to Home</RouterLink>
        </div>
    </div>
  </div>
</template>

<style scoped>
.success-container { min-height: 90vh; display: flex; align-items: center; justify-content: center; background-color: #f3f4f6; padding: 2rem; }
.card { background: white; padding: 3rem; border-radius: 12px; max-width: 600px; width: 100%; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }

.icon-check { width: 80px; height: 80px; background-color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
h1 { color: #111827; margin-bottom: 0.5rem; }
.subtitle { color: #6b7280; margin-bottom: 2rem; }

.details-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; text-align: left; }
.car-summary { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb; }
.car-summary img { width: 80px; height: 50px; object-fit: cover; border-radius: 4px; }
.car-summary h3 { margin: 0; font-size: 1.1rem; }
.year { color: #6b7280; font-size: 0.9rem; }

.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.info-item { display: flex; flex-direction: column; }
.label { font-size: 0.8rem; color: #6b7280; text-transform: uppercase; font-weight: 600; }
.value { font-weight: 500; color: #111; }
.cost { color: #0056b3; font-weight: 700; font-size: 1.1rem; }
.status-badge { display: inline-block; background: #fff3cd; color: #856404; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; width: fit-content; }

.instructions { text-align: left; margin-bottom: 2rem; }
.instructions h4 { font-size: 1rem; margin-bottom: 0.5rem; }
.instructions ul { padding-left: 1.2rem; color: #4b5563; }
.instructions li { margin-bottom: 0.25rem; }

.actions { display: flex; gap: 1rem; justify-content: center; }
.btn { padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: 600; transition: opacity 0.2s; }
.primary { background: #111827; color: white; }
.secondary { background: #e5e7eb; color: #374151; }
.btn:hover { opacity: 0.9; }
</style>