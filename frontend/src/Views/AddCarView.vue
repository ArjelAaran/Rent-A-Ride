<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../lib/apiClient';

const router = useRouter();
const loading = ref(false);
const message = ref('');
const filePreview = ref(null);
const carImage = ref(null);

const carData = reactive({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Sedan',
    dailyRate: '',
    description: ''
});

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        carImage.value = file;
        filePreview.value = URL.createObjectURL(file);
    }
};

const handleSubmit = async () => {
    if (!carImage.value) {
        alert("Please upload an image of your car.");
        return;
    }

    loading.value = true;

    try {
        const formData = new FormData();
        formData.append('make', carData.make);
        formData.append('model', carData.model);
        formData.append('year', carData.year);
        formData.append('type', carData.type);
        formData.append('dailyRate', carData.dailyRate);
        formData.append('description', carData.description);
        formData.append('carImage', carImage.value);

        await apiClient.post('/cars', formData);

        alert("Car listed successfully!");
        router.push('/'); // Go back to Home to see the car

    } catch (error) {
        console.error(error);
        message.value = "Failed to list car.";
    } finally {
        loading.value = false;
    }
};
</script>

<template>
  <div class="add-car-container">
    <h1>List Your Car</h1>
    <p class="subtitle">Turn your car into extra income.</p>

    <form @submit.prevent="handleSubmit" class="car-form">
        
        <div class="upload-box">
            <div v-if="filePreview" class="preview">
                <img :src="filePreview" alt="Preview" />
            </div>
            <div v-else class="placeholder">
                <span>+ Upload Car Photo</span>
            </div>
            <input type="file" @change="handleFileChange" accept="image/*" required />
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Make (Brand)</label>
                <input type="text" v-model="carData.make" placeholder="Toyota" required />
            </div>
            <div class="form-group">
                <label>Model</label>
                <input type="text" v-model="carData.model" placeholder="Vios" required />
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Year</label>
                <input type="number" v-model="carData.year" placeholder="2024" required />
            </div>
            <div class="form-group">
                <label>Type</label>
                <select v-model="carData.type">
                    <option>Sedan</option>
                    <option>SUV</option>
                    <option>Van</option>
                    <option>Truck</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label>Daily Rate (₱)</label>
            <input type="number" v-model="carData.dailyRate" placeholder="1500" required />
        </div>

        <div class="form-group">
            <label>Description</label>
            <textarea v-model="carData.description" placeholder="Good condition, AC works well..."></textarea>
        </div>

        <button type="submit" :disabled="loading" class="submit-btn">
            {{ loading ? 'Listing...' : 'List Car Now' }}
        </button>
        <p v-if="message" class="error">{{ message }}</p>
    </form>
  </div>
</template>

<style scoped>
.add-car-container { max-width: 600px; margin: 3rem auto; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
h1 { text-align: center; margin-bottom: 0.5rem; }
.subtitle { text-align: center; color: #666; margin-bottom: 2rem; }

.upload-box { position: relative; height: 200px; border: 2px dashed #ccc; border-radius: 8px; overflow: hidden; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center; background: #f9f9f9; }
.upload-box input { position: absolute; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
.preview img { width: 100%; height: 100%; object-fit: cover; }
.placeholder { color: #888; font-weight: bold; }

.form-row { display: flex; gap: 1rem; }
.form-group { flex: 1; margin-bottom: 1rem; }
label { display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; }
input, select, textarea { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; }
textarea { height: 100px; }

.submit-btn { width: 100%; padding: 1rem; background: #111827; color: white; border: none; border-radius: 6px; font-weight: bold; font-size: 1rem; cursor: pointer; margin-top: 1rem; }
.submit-btn:hover { background: #000; }
.error { color: red; text-align: center; margin-top: 1rem; }
</style>