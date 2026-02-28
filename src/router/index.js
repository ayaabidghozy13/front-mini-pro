import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FormView from '../views/FormView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/ajouter', component: FormView },
  { path: '/modifier/:id', component: FormView, props: true } // :id permet de savoir quel médicament on modifie
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router