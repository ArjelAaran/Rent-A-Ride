<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../lib/apiClient';

const user = ref({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    driversLicenseUrl: null
});
const loading = ref(false);
const message = ref('');
const isSuccess = ref(false);
const selectedFile = ref(null);
const previewUrl = ref(null);

onMounted(async () => {
    try {
        const response = await apiClient.get('/auth/user');
        const d = response.data;
        user.value = {
            firstName: d.first_name,
            lastName: d.last_name,
            email: d.email,
            phoneNumber: d.phone_number,
            driversLicenseUrl: d.drivers_license_url
            ? `http://localhost:3000${d.drivers_license_url}` 
                : null
        };
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
});
const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        previewUrl.value = URL.createObjectURL(file);
    }
};
const handleUpdate = async () => {
    loading.value = true;
    message.value = '';

    try {
        const formData = new FormData();
        formData.append('firstName', user.value.firstName);
        formData.append('lastName', user.value.lastName);
        formData.append('email', user.value.email);
        formData.append('phoneNumber', user.value.phoneNumber);

        if (selectedFile.value) {
            formData.append('driversLicense', selectedFile.value);
        }

        const response = await apiClient.put('/auth/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        const currentUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        message.value = 'Profile updated successfully!';
        isSuccess.value = true;
        
        if (response.data.user.driversLicenseUrl) {
            user.value.driversLicenseUrl = `http://localhost:3000${response.data.user.driversLicenseUrl}`;
            previewUrl.value = null; 
        }

    } catch (error) {
        message.value = error.response?.data?.message || 'Failed to update profile.';
        isSuccess.value = false;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
  <div class="profile-container">
    <h1>Edit Profile</h1>
    
    <div v-if="message" :class="['message', isSuccess ? 'success' : 'error']">
        {{ message }}
    </div>

    <form @submit.prevent="handleUpdate" class="profile-form">
        <div class="form-group">
            <label>First Name</label>
            <input type="text" v-model="user.firstName" required />
        </div>

        <div class="form-group">
            <label>Last Name</label>
            <input type="text" v-model="user.lastName" required />
        </div>

        <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="user.email" required />
        </div>

        <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" v-model="user.phoneNumber" placeholder="0912 345 6789" />
        </div>

        <div class="form-group upload-section">
            <label>Driver's License (Image)</label>
            
            <div v-if="user.driversLicenseUrl && !previewUrl" class="image-preview">
                <p>Current Upload:</p>
                <img :src="user.driversLicenseUrl" alt="Current License" />
            </div>

            <div v-if="previewUrl" class="image-preview">
                <p>Selected New Image:</p>
                <img :src="previewUrl" alt="New License Preview" />
            </div>

            <input type="file" @change="handleFileChange" accept="image/*" />
        </div>
        <button type="submit" :disabled="loading" class="save-btn">
            {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
    </form>
  </div>
</template>

<style scoped>
.profile-container { max-width: 600px; margin: 3rem auto; padding: 2rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
h1 { text-align: center; margin-bottom: 2rem; color: #333; }
.form-row { display: flex; gap: 1rem; }
.form-row .form-group { flex: 1; }
.form-group { margin-bottom: 1.5rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #4b5563; }
input[type="text"], input[type="email"], input[type="tel"] { 
    width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem;
}
.upload-section { border: 2px dashed #e5e7eb; padding: 1.5rem; border-radius: 8px; text-align: center; }
.image-preview img { max-width: 100%; height: auto; max-height: 200px; border-radius: 4px; margin-top: 0.5rem; border: 1px solid #ddd; }
.save-btn { width: 100%; padding: 1rem; background: #111827; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 600; }
.save-btn:hover { background: #000; }
.message { padding: 1rem; margin-bottom: 1rem; border-radius: 6px; text-align: center; }
.success { background-color: #d1fae5; color: #065f46; }
.error { background-color: #fee2e2; color: #991b1b; }
</style>