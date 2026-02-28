import { createRouter, createWebHistory } from 'vue-router'
// CHECK THESE TWO LINES CAREFULLY:
import InventoryView  from '../views/InventoryView.vue'    // This should be your LIST page
import MedicineFormView from '../views/MedicineFormVie.vue' // This should be your FORM page

const routes = [
  { 
    path: '/', 
    component: InventoryView  // '/' (Home/Inventaire) must point to the List
  },
  { 
    path: '/ajouter', 
    component: MedicineFormView // '/ajouter' must point to the Form
  },
  { 
    path: '/modifier/:id', 
    component: MedicineFormView, 
    props: true 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router