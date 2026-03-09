<script setup>

import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter() // p changer de page manuellement
const route = useRoute()   // P savoir sur quelle page on se trouve
const isLogged = ref(false) // État pour savoir si l'utilisateur est connecté

// Fonction qui vérifie si le "badge" de connexion est présent dans la mémoire du navigateur
const checkAuth = () => {
  isLogged.value = localStorage.getItem('isLoggedIn') === 'true'
}

/** * SURVEILLANCE : 
 * À chaque fois que l'utilisateur change de lien, on vérifie s'il est toujours connecté.
 * Cela permet de cacher ou d'afficher le menu immédiatement.
 */
watch(
  () => route.path,
  () => {
    checkAuth()
  },
  { immediate: true }
)

// Fonction pour se déconnecter c'est a dire on efface la mémoire et on retourne au login
const logout = () => {
  localStorage.removeItem('isLoggedIn')
  isLogged.value = false
  router.push('/')
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-content">
      
      <div class="logo" @click="$router.push(isLogged ? '/dashboard' : '/')">
        <span class="cross">✚</span>
        <h2>Pharma<span>Gestion</span></h2>
      </div>

      <div class="liens" v-if="isLogged">
        
        <router-link to="/dashboard" class="nav-link" active-class="active-link">
          Accueil
        </router-link>

        <router-link to="/inventory" class="nav-link" active-class="active-link">
          Inventaire
        </router-link>
        
        <router-link to="/ajouter" class="btn-add">
          ＋ Nouveau Médicament
        </router-link>

        <div class="profile-container">
          <div class="profile-badge">
            <div class="avatar-wrapper">
              <img 
                src="https://ui-avatars.com/api/?name=Pharmacien+Admin&background=27ae60&color=fff" 
                alt="Profil" 
                class="profile-img"
              />
            </div>
            <span class="user-name">Pharmacien</span>
            
            <div class="dropdown-menu">
              <div class="dropdown-header">Mon Compte</div>
              
              <button @click="logout" class="logout-item">
                <div class="logout-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </div>
                <span>Déconnexion</span>
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

/* Style du Logo */
.logo { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.cross { color: #27ae60; font-size: 1.8rem; font-weight: 900; }
.logo h2 { margin: 0; color: #2c3e50; font-size: 1.4rem; font-weight: 800; }
.logo h2 span { color: #27ae60; font-weight: 400; }

/* Liens de navigation */
.liens { display: flex; align-items: center; gap: 2rem; }
.nav-link { 
  text-decoration: none; 
  color: #7f8c8d; 
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
}
.nav-link:hover, .active-link { color: #27ae60; }

.active-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #27ae60;
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
}
.btn-add:hover { background: #219150; transform: translateY(-2px); }

.profile-container { position: relative; margin-left: 10px; }
.profile-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 4px;
  background: #f8fbf9;
  border-radius: 50px;
  border: 1px solid #e3f9eb;
  cursor: pointer;
}
.avatar-wrapper { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; border: 2px solid white; }
.profile-img { width: 100%; height: 100%; object-fit: cover; }
.user-name { font-size: 0.9rem; font-weight: 600; color: #2c3e50; }

.dropdown-menu {
  position: absolute;
  top: 130%;
  right: 0;
  background: white;
  min-width: 190px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border: 1px solid #f1f2f6;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
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
  background: #fafbfc;
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
  gap: 12px;
}
.logout-item:hover { background: #fff5f5; }

@media (max-width: 768px) {
  .user-name, .logo h2 { display: none; }
  .liens { gap: 1rem; }
}
</style>