import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import InventoryView from '../views/InventoryView.vue'
import MedicineFormView from '../views/MedicineFormView.vue'

const routes = [
  { 
    path: '/', 
    name: 'login',
    component: LoginView 
  },
  { 
    path: '/inventory', 
    name: 'inventory',
    component: InventoryView 
  },
  { 
    path: '/ajouter', 
    name: 'add-medicine',
    component: MedicineFormView 
  },
  { 
    path: '/modifier/:id', 
    name: 'edit-medicine',
    component: MedicineFormView, 
    props: true 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true'
  
  if (to.path !== '/' && !isAuthenticated) {
    // If trying to access inventory without "logging in", send back to Enter screen
    next('/')
  } else {
    next()
  }
})