<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()
const isLogged = ref(false)

// Fonction pour vérifier l'état d'authentification
const checkAuth = () => {
  isLogged.value = localStorage.getItem('isLoggedIn') === 'true'
}

// Surveillance de la route pour mettre à jour l'affichage en temps réel
watch(
  () => route.path,
  () => {
    checkAuth()
  },
  { immediate: true }
)

// Fonction de déconnexion
const logout = () => {
  localStorage.removeItem('isLoggedIn')
  isLogged.value = false
  router.push('/')
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-content">
      <div class="logo" @click="$router.push(isLogged ? '/inventory' : '/')">
        <span class="cross">✚</span>
        <h2>Pharma<span>Gestion</span></h2>
      </div>

      <div class="liens" v-if="isLogged">
        <router-link to="/inventory" class="nav-link" active-class="active-link">
          Inventaire
        </router-link>
        
        <router-link to="/ajouter" class="btn-add">
          ＋ Nouveau Médicament
        </router-link>

        <div class="profile-container">
          <div class="profile-badge">
            <span class="avatar">👨‍⚕️</span>
            <span class="user-name">Pharmacien</span>
            <div class="dropdown-menu">
              <div class="dropdown-header">Mon Compte</div>
              <button @click="logout" class="logout-item">
                <span class="icon">🚪</span> Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 0.8rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 4px solid #27ae60;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.logo { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  cursor: pointer; 
}

.cross { 
  color: #27ae60; 
  font-size: 1.8rem; 
  font-weight: 900; 
  filter: drop-shadow(0 2px 4px rgba(39, 174, 96, 0.2));
}

.logo h2 { 
  margin: 0; 
  color: #2c3e50; 
  font-size: 1.4rem;
  font-weight: 800; 
  letter-spacing: -0.5px;
}

.logo h2 span { 
  color: #27ae60; 
  font-weight: 400;
}

.liens { 
  display: flex; 
  align-items: center; 
  gap: 2rem; 
}

.nav-link { 
  text-decoration: none; 
  color: #7f8c8d; 
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover, .active-link { 
  color: #27ae60; 
}

.active-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #27ae60;
  border-radius: 2px;
}

.btn-add {
  text-decoration: none;
  background: #27ae60;
  color: white !important;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(39, 174, 96, 0.2);
}

.btn-add:hover { 
  background: #219150; 
  transform: translateY(-2px);
}

/* --- Styles du Profil --- */
.profile-container {
  position: relative;
  margin-left: 10px;
}

.profile-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 12px;
  background: #f8fbf9;
  border-radius: 50px;
  border: 1px solid #e3f9eb;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar {
  font-size: 1.2rem;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
}

/* Menu Déroulant */
.dropdown-menu {
  position: absolute;
  top: 125%;
  right: 0;
  background: white;
  min-width: 180px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border: 1px solid #f1f2f6;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-container:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-header {
  padding: 12px 15px;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #bdc3c7;
  font-weight: 800;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f1f2f6;
}

.logout-item {
  width: 100%;
  padding: 12px 15px;
  border: none;
  background: none;
  text-align: left;
  color: #e74c3c;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 0 0 12px 12px;
  transition: background 0.2s;
}

.logout-item:hover {
  background: #fff5f5;
}

@media (max-width: 768px) {
  .user-name, .logo h2 { display: none; }
  .liens { gap: 1rem; }
}
</style>