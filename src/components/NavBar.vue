<template>
  <nav class="navbar">
    <div class="nav-content">
      <div class="logo" @click="$router.push('/')">
        <span class="cross">✚</span>
        <h2>Pharma<span>Gestion</span></h2>
      </div>

      <div class="liens">
        <router-link to="/" class="nav-link" active-class="active-link">
          Inventaire
        </router-link>
        <router-link to="/ajouter" class="btn-add">
          ＋ Nouveau Médicament
        </router-link>
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
  border-bottom: 4px solid #27ae60; /* Ta couleur verte */
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
  gap: 2.5rem; 
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

/* Petit trait sous le lien actif */
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
  padding: 10px 22px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  transition: all 0.3s transform;
  box-shadow: 0 4px 10px rgba(39, 174, 96, 0.2);
}

.btn-add:hover { 
  background: #219150; 
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(39, 174, 96, 0.3);
}

@media (max-width: 600px) {
  .logo h2 { display: none; } /* On cache le texte sur petit mobile pour garder la croix */
}
</style>