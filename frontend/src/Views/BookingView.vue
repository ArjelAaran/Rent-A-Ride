<template>
    <div class="booking-page">
        <h2>Book Your Rental</h2>
        <p>Booking form coming soon for Car ID: {{ $route.params.carId }}</p>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'; 

const route = useRoute();
console.log('Booking car ID:', route.params.carId);
</script>

<style scoped>
.booking-page {
    padding: 2rem;
    text-align: center;
}
</style>