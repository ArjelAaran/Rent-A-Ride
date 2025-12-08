<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../lib/apiClient' 

const router = useRouter()
const user = ref(null)

const rentals = ref([]) 
const myCars = ref([]);
const loading = ref(true)

const showPayModal = ref(false);
const selectedRental = ref(null);
const payFile = ref(null);
const payLoading = ref(false);
const payMessage = ref('');


const fetchData = async (userId) => {
    loading.value = true;
    try {
        const rentalRes = await apiClient.get(`/cars/rentals/${userId}`);
        rentals.value = rentalRes.data;

        const carRes = await apiClient.get('/cars/my-listings');
        myCars.value = carRes.data;

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response?.status === 401) handleLogout();
    } finally {
        loading.value = false;
    }
}

const handleCancel = async (rentalId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
        return;
    }

    try {
        await apiClient.delete(`/cars/rentals/${rentalId}`);
        
        const rental = rentals.value.find(r => r.rental_id === rentalId);
        if (rental) {
            rental.status = 'cancelled';
        }

        alert("Booking cancelled.");
        
    } catch (error) {
        console.error('Error cancelling:', error);
        alert("Failed to cancel booking.");
    }
};

const handleDeleteCar = async (carId) => {
    if (!confirm("Are you sure you want to remove this listing? This action cannot be undone.")) {
        return;
    }

    try {
        await apiClient.delete(`/cars/${carId}`);
        myCars.value = myCars.value.filter(c => c.car_id !== carId);
        alert("Listing removed successfully.");
    } catch (error) {
        alert(error.response?.data?.message || "Failed to delete listing.");
    }
};
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
            fetchData(user.value.id);
        }, 1000);

    } catch (error) {
        console.error(error);
        payMessage.value = "Upload failed. Try again.";
    } finally {
        payLoading.value = false;
    }
}
const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    router.push('/login')
}

onMounted(async () => {
    const userData = localStorage.getItem('user');
    if (userData) {
        user.value = JSON.parse(userData);
        await fetchData(user.value.id);
    } else {
        router.push('/login');
    }
})
</script>

<template>
  <div class="dashboard-container">
    
    <h2>My Rentals</h2>
    <div v-if="loading">Loading data...</div>
    <div v-else-if="rentals.length === 0" class="empty-msg">You have no recorded rentals.</div>
    
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
                    
                    <button v-if="rental.status !== 'cancelled'" 
                            @click="handleCancel(rental.rental_id)" 
                            class="cancel-btn">
                        Cancel
                    </button>

                    <span v-if="rental.status === 'cancelled'" class="text-muted">
                        -
                    </span>
                </td>
            </tr>
        </tbody>
    </table>

    <hr class="divider" />

    <div class="header-row">
        <h2>My Listed Cars</h2>
        <RouterLink to="/list-car" class="add-btn">+ List New Car</RouterLink>
    </div>

    <div v-if="!loading && myCars.length === 0" class="empty-msg">
        You haven't listed any cars yet.
    </div>

    <table v-else class="rentals-table">
        <thead>
            <tr>
                <th>Car</th>
                <th>Rate</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="car in myCars" :key="car.car_id">
                <td>
                    <div class="car-cell">
                         <img :src="car.image_url.startsWith('http') ? car.image_url : `http://localhost:3000${car.image_url}`" class="thumb" />
                        <span>{{ car.make }} {{ car.model }} ({{ car.year }})</span>
                    </div>
                </td>
                <td>₱{{ parseFloat(car.daily_rate).toLocaleString() }} / day</td>
                <td>
                    <span :class="car.is_available ? 'status-active' : 'status-pending'">
                        {{ car.is_available ? 'Active' : 'Unavailable' }}
                    </span>
                </td>
                <td>
                    <button @click="handleDeleteCar(car.car_id)" class="cancel-btn">
                        Delete Listing
                    </button>
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

.rentals-table { width: 100%; border-collapse: collapse; margin-top: 1rem; margin-bottom: 2rem; }
.rentals-table th, .rentals-table td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
.text-muted { color: #999; }
.empty-msg { color: #666; font-style: italic; margin-bottom: 2rem; }

.status-paid { color: green; font-weight: bold; text-transform: capitalize; }
.status-pending { color: orange; font-weight: bold; text-transform: capitalize; }
.status-cancelled { color: #dc2626; font-weight: bold; text-transform: capitalize; }
.status-active { color: green; font-weight: bold; }

.pay-btn-small { background: #0056b3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
.pay-btn-small:hover { background: #004494; }

.cancel-btn { background: #dc2626; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 8px; }
.cancel-btn:hover { background: #b91c1c; }

.add-btn { background: #111827; color: white; text-decoration: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; font-size: 0.9rem; }
.add-btn:hover { background: #000; }

.divider { margin: 3rem 0; border: 0; border-top: 1px solid #eee; }
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.car-cell { display: flex; align-items: center; gap: 10px; }
.thumb { width: 50px; height: 35px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; }

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