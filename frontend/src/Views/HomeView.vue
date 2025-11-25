<script setup>
// HARDCODED DATA FOR MVP (We replace this with Supabase later if time permits)
const cars = [
  { id: 1, name: "Toyota Vios", price: "₱1,500", type: "Sedan", image: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 2, name: "Ford Territory", price: "₱3,500", type: "SUV", image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 3, name: "Honda Civic", price: "₱2,500", type: "Sedan", image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600" }
];
</script>

<template>
  <div class="home-container">
    <section class="hero">
      <div class="hero-content">
        <h1>Drive Your Dream Today</h1>
        <p>Premium rentals at economy prices.</p>
        <RouterLink to="/register" class="cta-btn">Book Now</RouterLink>
      </div>
    </section>

    <section class="fleet">
      <h2>Our Fleet</h2>
      <div class="grid">
        <div v-for="car in cars" :key="car.id" class="card">
          <img :src="car.image" alt="Car" />
          <div class="card-body">
            <h3>{{ car.name }}</h3>
            <p class="price">{{ car.price }} <span class="per-day">/ day</span></p>
            <button class="book-btn">Rent This Car</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* HERO */
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
}
.hero h1 { font-size: 3rem; margin-bottom: 0.5rem; }
.hero p { font-size: 1.5rem; margin-bottom: 2rem; }
.cta-btn { background: #ff6600; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }

/* FLEET */
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