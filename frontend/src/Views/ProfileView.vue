<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../lib/apiClient';

const isEditing = ref(false);
const loading = ref(false);
const message = ref('');
const isSuccess = ref(false);

const user = ref({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    driversLicenseUrl: null 
});

const editForm = ref({});
const selectedFile = ref(null);
const previewUrl = ref(null);


const fetchProfile = async () => {
    try {
        const response = await apiClient.get('/auth/user');
        const d = response.data;
        
        user.value = {
            firstName: d.first_name,
            lastName: d.last_name,
            email: d.email,
            phoneNumber: d.phone_number || 'Not set',
            driversLicenseUrl: d.drivers_license_url 
                ? `http://localhost:3000${d.drivers_license_url}` 
                : null
        };
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
};

const startEditing = () => {
    editForm.value = { ...user.value };
    selectedFile.value = null;
    previewUrl.value = null;
    message.value = '';
    isEditing.value = true;
};

const cancelEditing = () => {
    isEditing.value = false;
    message.value = '';
};

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
        formData.append('firstName', editForm.value.firstName);
        formData.append('lastName', editForm.value.lastName);
        formData.append('email', editForm.value.email);
        formData.append('phoneNumber', editForm.value.phoneNumber);

        if (selectedFile.value) {
            formData.append('driversLicense', selectedFile.value);
        }

        const response = await apiClient.put('/auth/profile', formData);

        const currentUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        user.value = {
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            email: response.data.user.email,
            phoneNumber: response.data.user.phoneNumber,
            driversLicenseUrl: response.data.user.driversLicenseUrl 
                ? `http://localhost:3000${response.data.user.driversLicenseUrl}` 
                : user.value.driversLicenseUrl
        };

        message.value = 'Profile updated successfully!';
        isSuccess.value = true;
        
        setTimeout(() => {
            isEditing.value = false;
            message.value = '';
        }, 1500);

    } catch (error) {
        message.value = error.response?.data?.message || 'Failed to update profile.';
        isSuccess.value = false;
    } finally {
        loading.value = false;
    }
};

onMounted(fetchProfile);
</script>

<template>
  <div class="profile-container">
    
    <div v-if="!isEditing" class="profile-card fade-in">
        <div class="header">
            <div class="avatar-circle">
                {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
            </div>
            <h1>{{ user.firstName }} {{ user.lastName }}</h1>
            <p class="role">Registered Customer</p>
        </div>

        <div class="details-grid">
            <div class="detail-item">
                <label>Email Address</label>
                <p>{{ user.email }}</p>
            </div>
            <div class="detail-item">
                <label>Phone Number</label>
                <p>{{ user.phoneNumber }}</p>
            </div>
            <div class="detail-item full-width">
                <label>Driver's License</label>
                <div v-if="user.driversLicenseUrl" class="license-box">
                    <img :src="user.driversLicenseUrl" alt="My License" />
                </div>
                <p v-else class="text-muted">No license uploaded yet.</p>
            </div>
        </div>

        <button @click="startEditing" class="btn primary-btn">Edit Profile</button>
    </div>


    <div v-else class="edit-card fade-in">
        <h2>Update Information</h2>
        
        <div v-if="message" :class="['message', isSuccess ? 'success' : 'error']">
            {{ message }}
        </div>

        <form @submit.prevent="handleUpdate">
            <div class="form-row">
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" v-model="editForm.firstName" required />
                </div>
                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" v-model="editForm.lastName" required />
                </div>
            </div>

            <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="editForm.email" required />
            </div>

            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" v-model="editForm.phoneNumber" placeholder="0912 345 6789" />
            </div>

            <div class="form-group upload-section">
                <label>Update Driver's License</label>
                
                <div v-if="previewUrl" class="image-preview">
                    <p>New Image Selected:</p>
                    <img :src="previewUrl" alt="New Preview" />
                </div>
                <div v-else-if="user.driversLicenseUrl" class="image-preview">
                    <p>Current Image:</p>
                    <img :src="user.driversLicenseUrl" alt="Current License" class="dimmed" />
                </div>

                <input type="file" @change="handleFileChange" accept="image/*" />
            </div>

            <div class="action-buttons">
                <button type="button" @click="cancelEditing" class="btn secondary-btn">Cancel</button>
                <button type="submit" :disabled="loading" class="btn primary-btn">
                    {{ loading ? 'Saving...' : 'Save Changes' }}
                </button>
            </div>
        </form>
    </div>

  </div>
</template>

<style scoped>
.profile-container { max-width: 600px; margin: 3rem auto; padding: 0 1rem; }

.profile-card, .edit-card {
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    border: 1px solid #f0f0f0;
}

.header { text-align: center; margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 2rem; }
.avatar-circle {
    width: 80px; height: 80px; background: #111827; color: white;
    font-size: 2rem; font-weight: bold; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
}
.header h1 { margin: 0; font-size: 1.5rem; color: #111; }
.role { color: #6b7280; font-size: 0.9rem; margin-top: 0.25rem; }

.details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
.full-width { grid-column: 1 / -1; }
.detail-item label { display: block; font-size: 0.8rem; color: #6b7280; text-transform: uppercase; font-weight: 600; margin-bottom: 0.25rem; }
.detail-item p { font-size: 1.1rem; color: #111; font-weight: 500; margin: 0; }

.license-box img { width: 100%; max-height: 200px; object-fit: contain; border: 1px solid #ddd; border-radius: 6px; margin-top: 0.5rem; }
.text-muted { color: #999; font-style: italic; }

.form-row { display: flex; gap: 1rem; }
.form-row .form-group { flex: 1; }
.form-group { margin-bottom: 1.25rem; }
input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; }

.upload-section { border: 2px dashed #e5e7eb; padding: 1.5rem; border-radius: 8px; text-align: center; }
.image-preview img { max-width: 100%; height: 150px; object-fit: cover; margin: 0.5rem 0; border-radius: 4px; }
.dimmed { opacity: 0.6; }

.btn { width: 100%; padding: 0.875rem; border-radius: 6px; font-weight: 600; cursor: pointer; border: none; font-size: 1rem; transition: opacity 0.2s; }
.primary-btn { background: #111827; color: white; }
.secondary-btn { background: #f3f4f6; color: #374151; }
.btn:hover { opacity: 0.9; }

.action-buttons { display: flex; gap: 1rem; }

.message { padding: 1rem; margin-bottom: 1rem; border-radius: 6px; text-align: center; }
.success { background: #d1fae5; color: #065f46; }
.error { background: #fee2e2; color: #991b1b; }
.fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>