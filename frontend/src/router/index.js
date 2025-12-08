import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../Views/HomeView.vue'
import LoginView from '../Views/LoginView.vue'
import RegisterView from '../Views/RegisterView.vue'
import AboutView from '../Views/AboutView.vue'
import ContactView from '../Views/ContactView.vue'
import CustomerDashboardView from '../Views/CustomerDashboardView.vue'
import ProfileView from '../Views/ProfileView.vue';
import BookingSuccessView from '../Views/BookingSuccessView.vue';
import TermsView from '../Views/TermsView.vue';
import FAQView from '../Views/FAQView.vue';
import AddCarView from '../Views/AddCarView.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/contact', name: 'contact', component: ContactView },
    { path: '/dashboard', name: 'dashboard', component: CustomerDashboardView },
    { path: '/profile', name: 'profile', component: ProfileView },
  {
      path: '/book/:carId',
      name: 'booking',
      component: () => import('../views/BookingView.vue') 
    },
    { path: '/booking-success/:id', name: 'booking-success', component: BookingSuccessView },
  { path: '/terms', name: 'terms', component: TermsView },
    { path: '/faq', name: 'faq', component: FAQView },
    { path: '/list-car', name: 'add-car', component: AddCarView },
  ]
})

export default router