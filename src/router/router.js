import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import InventoryView from '../views/InventoryView.vue'
import MedicineFormView from '../views/MedicineFormView.vue'
import Acceuil from '../views/Acceuil.vue'

const routes = [
  { 
    path: '/', 
    name: 'login',
    component: LoginView 
  },
  { 
    path: '/dashboard', 
    name: 'dashboard',
    component: Acceuil 
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

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true'
  
  // Si on essaie d'aller ailleurs qu'au login sans être connecté
  if (to.path !== '/' && !isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
