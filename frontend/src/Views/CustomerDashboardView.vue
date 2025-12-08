<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../lib/apiClient' 

const router = useRouter()
const user = ref(null)
const rentals = ref([]) 
const loading = ref(true)
const rentalsLoading = ref(true)

const showPayModal = ref(false);
const selectedRental = ref(null);
const payFile = ref(null);
const payLoading = ref(false);
const payMessage = ref('');

const fetchRentals = async (userId) => {
    try {
        const response = await apiClient.get(`/cars/rentals/${userId}`);
        rentals.value = response.data;
    } catch (error) {
        console.error('Error fetching rentals:', error);
        if (error.response?.status === 401) handleLogout();
    } finally {
        rentalsLoading.value = false;
    }
}

const openPayModal = (rental) => {
    selectedRental.value = rental;
    showPayModal.value = true;
    payMessage.value = '';
    payFile.value = null;
}

const closePayModal = () => {
    showPayModal.value = false;
    selectedRental.value = null;
}

const handlePayFileChange = (e) => {
    payFile.value = e.target.files[0];
}

const submitPayment = async () => {
    if (!payFile.value) {
        payMessage.value = "Please select a screenshot first.";
        return;
    }
    
    payLoading.value = true;
    
    try {
        const formData = new FormData();
        formData.append('receipt', payFile.value);

await apiClient.put(`/cars/rentals/${selectedRental.value.rental_id}/pay`, formData);
        payMessage.value = "Payment Uploaded!";
        setTimeout(() => {
            closePayModal();
            fetchRentals(user.value.id); 
        }, 1000);

    } catch (error) {
        console.error(error);
        payMessage.value = "Upload failed. Try again.";
    } finally {
        payLoading.value = false;
    }
}

onMounted(async () => {
    const userData = localStorage.getItem('user');
    if (userData) {
        user.value = JSON.parse(userData);
        await fetchRentals(user.value.id);
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
  <div class="dashboard-container">
    <h2>My Rentals</h2>
    <div v-if="rentalsLoading">Loading rentals...</div>
    <div v-else-if="rentals.length === 0">You have no recorded rentals.</div>
    
    <table v-else class="rentals-table">
        <thead>
            <tr>
                <th>Car</th>
                <th>Dates</th>
                <th>Total Cost</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="rental in rentals" :key="rental.rental_id">
                <td>{{ rental.make }} {{ rental.model }}</td>
                <td>{{ rental.start_date }} <br>to {{ rental.end_date }}</td>
                <td>₱{{ rental.total_cost.toLocaleString() }}</td>
                <td>
                    <span :class="['status-' + rental.status]">{{ rental.status }}</span>
                </td>
                <td>
                    <button v-if="rental.status === 'pending'" 
                            @click="openPayModal(rental)" 
                            class="pay-btn-small">
                        Pay Now
                    </button>
                    <span v-else class="text-muted">-</span>
                </td>
            </tr>
        </tbody>
    </table>

    <div v-if="showPayModal" class="modal-overlay">
        <div class="modal-content">
            <h3>Pay for Rental #{{ selectedRental.rental_id }}</h3>
            <p class="modal-amount">Amount Due: ₱{{ selectedRental.total_cost.toLocaleString() }}</p>
            
            <div class="qr-box">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="GCash QR" width="120">
                <p>Scan with GCash</p>
            </div>

            <input type="file" @change="handlePayFileChange" accept="image/*" class="file-input" />
            
            <p v-if="payMessage" class="modal-msg">{{ payMessage }}</p>

            <div class="modal-actions">
                <button @click="submitPayment" :disabled="payLoading" class="btn-confirm">
                    {{ payLoading ? 'Uploading...' : 'Submit Payment' }}
                </button>
                <button @click="closePayModal" class="btn-cancel">Cancel</button>
            </div>
        </div>
    </div>

  </div>
</template>

<style scoped>
.dashboard-container { padding: 2rem; max-width: 1000px; margin: 0 auto; }
.rentals-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
.rentals-table th, .rentals-table td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
.status-paid { color: green; font-weight: bold; }
.status-pending { color: orange; font-weight: bold; }
.text-muted { color: #999; }

.pay-btn-small { background: #0056b3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
.pay-btn-small:hover { background: #004494; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 400px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
.modal-amount { font-size: 1.2rem; font-weight: bold; color: #333; margin: 10px 0; }
.qr-box { margin: 15px 0; border: 1px solid #eee; padding: 10px; border-radius: 8px; display: inline-block; }
.file-input { margin: 15px 0; width: 100%; }
.modal-actions { display: flex; gap: 10px; justify-content: center; margin-top: 15px; }
.btn-confirm { background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
.btn-cancel { background: #ccc; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
.modal-msg { color: #d32f2f; font-weight: bold; margin: 10px 0; }
</style>