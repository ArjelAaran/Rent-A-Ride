<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'; 
import apiClient from '../lib/apiClient' 

const router = useRouter(); 
const cars = ref([]);
const loading = ref(true);
const error = ref(null);

const handleRentCar = (carId) => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        alert('Please log in to proceed with the rental booking.');
        router.push('/login');
    } else {
        router.push(`/book/${carId}`); 
    }
}

onMounted(async () => {
    try {
        const response = await apiClient.get('/cars'); 
        cars.value = response.data.map(car => {
            
            let imageUrl = 'https://via.placeholder.com/300';
            
            if (car.image_url) {
                if (car.image_url.startsWith('http')) {
                    imageUrl = car.image_url;
                } else {
                    imageUrl = `http://localhost:3000${car.image_url}`;
                }
            }

            return {
                id: car.car_id,
                name: `${car.make} ${car.model}`,
                price: `₱${parseFloat(car.daily_rate).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 
                type: car.type,
                image: imageUrl,
            };
        });
    } catch (err) {
        error.value = 'Failed to fetch car data.';
        console.error(err);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
  <section class="hero">
    <div class="hero-content">
        <h1>Find Your Drive</h1>
        <p>Rent cars from locals or list your own vehicle today.</p>
        
        <div class="hero-buttons">
            <a href="#fleet" class="cta-btn primary">Rent a Car</a>
            
            <RouterLink to="/list-car" class="cta-btn secondary">List Your Car</RouterLink>
        </div>
    </div>
  </section>
  <section class="fleet">
    <h2>Our Fleet</h2>
    <div v-if="loading">Loading available cars...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else class="grid">
      <div v-for="car in cars" :key="car.id" class="card">
        <img :src="car.image" alt="Car" />
        <div class="card-body">
          <h3>{{ car.name }}</h3>
          <p class="price">{{ car.price }} <span class="per-day">/ day</span></p>
          <button 
              class="book-btn" 
              @click="handleRentCar(car.id)"> 
              Rent This Car
          </button>
        </div>
      </div>
    </div>
  </section>
  
</template>

<style scoped>
.hero {
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
  background-size: cover;
  background-position: center;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  flex-direction: column;
}
.hero-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 20px;
}

.hero h1 { font-size: 3rem; margin-bottom: 0.5rem; }
.hero p { font-size: 1.5rem; margin-bottom: 2rem; }
.cta-btn {
    padding: 12px 30px;
    border-radius: 5px;
    font-weight: bold;
    text-decoration: none;
    transition: transform 0.2s;
}
.cta-btn:hover { transform: scale(1.05); }

.primary { background: #ff6600; color: white; }
.secondary { background: white; color: #111; }
.fleet { padding: 4rem 2rem; text-align: center; }
.fleet h2 { margin-bottom: 2rem; font-size: 2rem; color: #333; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
.card { border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.card img { width: 100%; height: 200px; object-fit: cover; }
.card-body { padding: 1.5rem; text-align: left; }
.price { font-size: 1.25rem; font-weight: bold; color: #0056b3; margin: 10px 0; }
.per-day { font-size: 0.9rem; color: #666; font-weight: normal; }
.book-btn { width: 100%; padding: 10px; background: #333; color: white; border: none; border-radius: 5px; cursor: pointer; }
</style>