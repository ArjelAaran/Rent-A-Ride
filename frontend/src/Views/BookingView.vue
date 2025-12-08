<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '../lib/apiClient';

const route = useRoute();
const router = useRouter();
const carId = ref(route.params.carId);
const carDetails = ref(null);
const loading = ref(false);
const loadingCarDetails = ref(true);
const message = ref('');
const isSuccess = ref(false);
const paymentMethod = ref(null);
const receiptFile = ref(null);

const minDate = new Date().toISOString().split('T')[0];
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
        console.error('Failed to fetch car details:', error);
    } finally {
        loadingCarDetails.value = false;
    }
};

const dailyRate = computed(() => carDetails.value ? parseFloat(carDetails.value.daily_rate) : 0);

const totalCost = computed(() => {
    if (dailyRate.value <= 0) return 0;
    
    const start = new Date(rentalData.startDate);
    const end = new Date(rentalData.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    if (start > end) return 0;
    
    const diffTime = end.getTime() - start.getTime(); 
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays * dailyRate.value : 0;
});

const handleFileChange = (event) => {
    receiptFile.value = event.target.files[0];
};

const handleSubmit = async () => {
    rentalData.totalCost = totalCost.value;

    const start = new Date(rentalData.startDate);
    const end = new Date(rentalData.endDate);
    const today = new Date();
    today.setHours(0,0,0,0); 

    if (start < today) {
        message.value = 'Start date cannot be in the past.';
        isSuccess.value = false; return;
    }

    if (start > end) {
        message.value = 'End date cannot be before the start date.';
        isSuccess.value = false; return;
    }

    if (rentalData.totalCost <= 0) {
        message.value = 'Please select valid dates.';
        isSuccess.value = false; return;
    }
    if (!paymentMethod.value) {
        message.value = 'Please select a payment method.';
        isSuccess.value = false; return;
    }
    if (paymentMethod.value === 'online' && !receiptFile.value) {
        message.value = 'Please upload your GCash payment screenshot.';
        isSuccess.value = false; return;
    }

    loading.value = true;
    message.value = '';

    try {
        const formData = new FormData();
        formData.append('carId', rentalData.carId);
        formData.append('startDate', rentalData.startDate);
        formData.append('endDate', rentalData.endDate);
        formData.append('totalCost', rentalData.totalCost);
        formData.append('paymentMethod', paymentMethod.value === 'pay_later' ? 'online' : paymentMethod.value);
        
        if (receiptFile.value) {
            formData.append('receipt', receiptFile.value);
        }

        const response = await apiClient.post('/cars/rentals', formData); 

        router.push(`/booking-success/${response.data.rentalId}`);

    } catch (err) {
        message.value = err.response?.data?.message || 'Booking failed.';
        isSuccess.value = false;
    } finally {
        loading.value = false;
    }
};

onMounted(fetchCarDetails);
</script>

<template>
  <div class="booking-container">
    <h2>Book Car ID: {{ carId }}</h2>
    
    <div v-if="carDetails">
      <p class="car-info">{{ carDetails.make }} {{ carDetails.model }} - ₱{{ dailyRate.toFixed(2) }} / day</p>
    </div>
    <div v-else class="message">Loading car details...</div>

    <form @submit.prevent="handleSubmit" class="booking-form">
      <div class="form-group">
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate" v-model="rentalData.startDate" required />
      </div>

      <div class="form-group">
        <label for="endDate">End Date:</label>
        <input type="date" id="endDate" v-model="rentalData.endDate" required />
      </div>

      <p v-if="totalCost > 0" class="total-cost">Total Cost: ₱{{ totalCost.toFixed(2) }}</p>

      <div v-if="totalCost > 0" class="payment-section">
        <h3>Select Payment Method</h3>
        
        <div class="payment-buttons">
            <button type="button" 
                :class="['pay-btn', paymentMethod === 'onsite' ? 'active' : '']" 
                @click="paymentMethod = 'onsite'">
                Pay Onsite (Cash)
            </button>
            <button type="button" 
                :class="['pay-btn', paymentMethod === 'online' ? 'active' : '']" 
                @click="paymentMethod = 'online'">
                Pay Now (GCash)
            </button>
            <button type="button" 
                :class="['pay-btn', paymentMethod === 'pay_later' ? 'active' : '']" 
                @click="paymentMethod = 'pay_later'">
                Pay Later (Online)
            </button>
        </div>

        <div v-if="paymentMethod === 'onsite'" class="payment-info fade-in">
            <div class="alert-box">
                <strong>Instructions:</strong> Please pay the full amount at the rental office upon pick-up.
                <p class="warning">⚠️ Note: If payment is not verified within 12 hours of the booking request, the system will automatically cancel this reservation.</p>
            </div>
        </div>

        <div v-if="paymentMethod === 'pay_later'" class="payment-info fade-in">
            <div class="alert-box">
                <strong>Instructions:</strong> Your booking will be saved as "Pending". 
                You can go to your Dashboard later to upload your GCash payment proof.
                <p class="warning">⚠️ Note: You must pay within 12 hours or the booking is cancelled.</p>
            </div>
        </div>

        <div v-if="paymentMethod === 'online'" class="payment-info fade-in">
            <div class="qr-container">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="GCash QR" class="qr-code">
                <p>Scan to Pay ₱{{ totalCost.toFixed(2) }}</p>
            </div>
            
            <div class="form-group">
                <label>Upload Proof of Payment (Screenshot)</label>
                <input type="file" @change="handleFileChange" accept="image/*" required />
            </div>

            <div class="alert-box">
                <p class="warning">⚠️ Note: If proof of payment is not uploaded and verified within 12 hours, the booking will be automatically cancelled.</p>
            </div>
        </div>
      </div>

      <button type="submit" :disabled="loading || totalCost <= 0" class="submit-btn">
        {{ loading ? 'Processing...' : 'Confirm Booking' }}
      </button>

      <div v-if="message" :class="['message', isSuccess ? 'success' : 'error']">{{ message }}</div>
    </form>
  </div>
</template>

<style scoped>
.booking-container { max-width: 600px; margin: 3rem auto; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); background: white; }
.booking-form { display: grid; gap: 1rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
.form-group input { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
.total-cost { font-size: 1.5rem; font-weight: 800; margin-top: 1rem; color: #0056b3; text-align: center; }

.payment-section { margin-top: 1rem; border-top: 1px solid #eee; padding-top: 1rem; }
.payment-buttons { display: flex; gap: 10px; margin-bottom: 1.5rem; }
.pay-btn { flex: 1; padding: 1rem; border: 2px solid #ddd; background: white; cursor: pointer; border-radius: 8px; font-weight: 600; transition: all 0.3s; }
.pay-btn:hover { background: #f9f9f9; }
.pay-btn.active { border-color: #0056b3; background-color: #e3f2fd; color: #0056b3; }

.alert-box { background: #fff3cd; color: #856404; padding: 1rem; border-radius: 6px; border: 1px solid #ffeeba; margin-top: 1rem; }
.warning { font-size: 0.9rem; margin-top: 0.5rem; font-weight: bold; }

.qr-container { text-align: center; margin-bottom: 1rem; }
.qr-code { width: 150px; height: 150px; border: 1px solid #ddd; padding: 5px; border-radius: 8px; }

.submit-btn { padding: 1rem; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1.1rem; margin-top: 1rem; }
.submit-btn:hover:not(:disabled) { background: #555; }
.submit-btn:disabled { background: #ccc; cursor: not-allowed; }

.message { padding: 1rem; margin-top: 1rem; border-radius: 4px; text-align: center; font-weight: bold; }
.success { background-color: #d4edda; color: #155724; }
.error { background-color: #f8d7da; color: #721c24; }
.fade-in { animation: fadeIn 0.5s; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>