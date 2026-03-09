<script setup>

import { ref, onMounted } from 'vue'
import { getMedicaments } from '../services/medicineService'

// Objet réactif pour stocker nos 4 compteurs
const stats = ref({
  total: 0,
  lowStock: 0,
  outOfStock: 0,
  categories: 0
})

const chargement = ref(true) // État pour afficher un message d'attente


onMounted(async () => {
  try {
    const meds = await getMedicaments()
    
    //  Nombre total de produits
    stats.value.total = meds.length
    
    // Produits avec stock faible (entre 1 et 5)
    stats.value.lowStock = meds.filter(m => m.qte > 0 && m.qte <= 5).length
    
    //  Produits en rupture de stock (0 ou moins)
    stats.value.outOfStock = meds.filter(m => m.qte <= 0).length
    
    //  Calcul des formes uniques (Comprimé, Sirop, etc.) via un "Set"
    const formes = [...new Set(meds.map(m => m.formepharmaceutique))]
    stats.value.categories = formes.length
    
  } catch (error) {
    console.error("Erreur lors du calcul des stats:", error)
  } finally {
    chargement.value = false // On cache le spinner de chargement
  }
})
</script>

<template>
  <div class="dashboard-container">
    <header class="dash-header">
      <div class="welcome-text">
        <h1>Tableau de Bord</h1>
        <p>Bienvenue sur votre interface de gestion <span>PharmaGestion</span></p>
      </div>
      <div class="date-badge">
        {{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) }}
      </div>
    </header>

    <div v-if="chargement" class="loader">
      <div class="spinner"></div>
      <p>Analyse des stocks en cours...</p>
    </div>

    <div v-else class="content">
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="icon-wrapper blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3498db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>
          </div>
          <div class="data">
            <span class="number">{{ stats.total }}</span>
            <span class="label">Produits référencés</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon-wrapper orange">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f39c12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <div class="data">
            <span class="number">{{ stats.lowStock }}</span>
            <span class="label">Stocks critiques</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon-wrapper red">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
          </div>
          <div class="data">
            <span class="number">{{ stats.outOfStock }}</span>
            <span class="label">En rupture</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon-wrapper green">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v8"></path><path d="M14 2v8"></path><path d="M8 10h8v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10Z"></path></svg>
          </div>
          <div class="data">
            <span class="number">{{ stats.categories }}</span>
            <span class="label">Formes galéniques</span>
          </div>
        </div>
      </div>

      <div class="action-section">
        <div class="action-card main-action" @click="$router.push('/inventory')">
          <div class="action-content">
            <h3>Gérer l'Inventaire</h3>
            <p>Accéder à la liste complète et modifier les quantités.</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>

        <div class="action-card secondary-action" @click="$router.push('/ajouter')">
          <div class="action-content">
            <h3>Nouveau Produit</h3>
            <p>Ajouter une nouvelle fiche médicament au système.</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/** * STYLE CSS : 
 * Design "Card-based" (en cartes) très populaire pour les interfaces métier.
 * J'ai utilisé Grid Layout pour aligner les statistiques de manière responsive.
 */
.dashboard-container { max-width: 1200px; margin: 0 auto; padding: 2.5rem 2rem; }

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.welcome-text h1 { font-size: 2.2rem; color: #2c3e50; margin: 0; font-weight: 800; }
.welcome-text p { color: #7f8c8d; margin-top: 5px; }
.welcome-text span { color: #27ae60; font-weight: 700; }

.date-badge {
  background: white;
  padding: 10px 22px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  color: #27ae60;
  font-weight: 700;
  border: 1px solid #e3f9eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 25px;
  margin-bottom: 3.5rem;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
  border: 1px solid #f1f2f6;
  transition: all 0.3s ease;
}

.stat-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.08); }

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Couleurs spécifiques par type de statistique */
.icon-wrapper.blue { background: #ebf5ff; }
.icon-wrapper.orange { background: #fff9eb; }
.icon-wrapper.red { background: #fff5f5; }
.icon-wrapper.green { background: #f0fff4; }

.data .number {
  display: block;
  font-size: 2rem;
  font-weight: 900;
  color: #2c3e50;
  line-height: 1.2;
}

.data .label { color: #95a5a6; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

.action-section {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 25px;
}

.action-card {
  padding: 35px;
  border-radius: 28px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.main-action { background: #27ae60; color: white; box-shadow: 0 10px 25px rgba(39, 174, 96, 0.2); }
.main-action:hover { background: #219150; transform: scale(1.02); }

.secondary-action { background: white; border: 2px solid #e3f9eb; color: #2c3e50; }
.secondary-action:hover { background: #f8fbf9; border-color: #27ae60; transform: scale(1.02); }

/* Animation du spinner de chargement */
.loader { text-align: center; padding: 5rem; }
.spinner {
  width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #27ae60;
  border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .action-section { grid-template-columns: 1fr; }
}
</style>
