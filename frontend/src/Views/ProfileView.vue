<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../lib/apiClient';

const user = ref({
    firstName: '',
    lastName: '',
    email: ''
});
const loading = ref(false);
const message = ref('');
const isSuccess = ref(false);

// Fetch current data when page loads
onMounted(async () => {
    try {
        const response = await apiClient.get('/auth/user');
        user.value = {
            firstName: response.data.first_name,
            lastName: response.data.last_name,
            email: response.data.email
        };
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
});

const handleUpdate = async () => {
    loading.value = true;
    message.value = '';
    
    try {
        const response = await apiClient.put('/auth/profile', user.value);
        
        // Update local storage with new details so other parts of the app know
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        message.value = 'Profile updated successfully!';
        isSuccess.value = true;
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

        <button type="submit" :disabled="loading" class="save-btn">
            {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
    </form>
  </div>
</template>

<style scoped>
.profile-container { max-width: 500px; margin: 3rem auto; padding: 2rem; border: 1px solid #e5e7eb; border-radius: 8px; }
h1 { text-align: center; margin-bottom: 2rem; }
.form-group { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
input { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; }
.save-btn { width: 100%; padding: 1rem; background: #0056b3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
.save-btn:hover { background: #004494; }
.message { padding: 1rem; margin-bottom: 1rem; border-radius: 4px; text-align: center; }
.success { background-color: #d4edda; color: #155724; }
.error { background-color: #f8d7da; color: #721c24; }
</style>