<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMedicaments, supprimerMedicament, modifierMedicament } from '../services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const medicaments = ref([])
const recherche = ref('')
const chargement = ref(true)

// Charger les données depuis l'API
async function chargerDonnees() {
  chargement.ref = true
  try {
    medicaments.value = await getMedicaments()
  } catch (erreur) {
    console.error("Erreur de connexion à l'API", erreur)
  } finally {
    chargement.value = false
  }
}

onMounted(() => {
  chargerDonnees()
})

// Filtrage intelligent (insensible à la casse et gère les valeurs nulles)
const medicamentsFiltres = computed(() => {
  if (!recherche.value) return medicaments.value;
  
  return medicaments.value.filter(med => {
    const nom = med.denomination ? med.denomination.toLowerCase() : '';
    return nom.includes(recherche.value.toLowerCase());
  })
})

// --- ACTIONS ---

async function retirerMedicament(id) {
  if (confirm("Voulez-vous vraiment supprimer ce médicament du stock ?")) {
    await supprimerMedicament(id)
    await chargerDonnees()
  }
}

async function augmenterStock(medicament) {
  const medModifie = { ...medicament, qte: medicament.qte + 1 }
  // On vide la photo pour ne pas renvoyer l'ancien nom de fichier (contrainte API)
  medModifie.photo = '' 
  await modifierMedicament(medModifie)
  await chargerDonnees()
}

async function diminuerStock(medicament) {
  if (medicament.qte > 0) {
    const medModifie = { ...medicament, qte: medicament.qte - 1 }
    medModifie.photo = ''
    await modifierMedicament(medModifie)
    await chargerDonnees()
  }
}

function allerVersModification(id) {
  router.push(`/modifier/${id}`)
}
</script>

<template>
  <div class="home-container">
    <header class="page-header">
      <div class="header-text">
        <h1>Inventaire</h1>
        <p v-if="medicaments.length">{{ medicamentsFiltres.length }} produits trouvés</p>
      </div>
      
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          v-model="recherche" 
          type="text" 
          placeholder="Rechercher un médicament..." 
        />
      </div>
    </header>

    <div v-if="chargement" class="loader">Chargement de la pharmacie...</div>

    <div v-else-if="medicamentsFiltres.length > 0" class="grid-stock">
      <div v-for="med in medicamentsFiltres" :key="med.id" class="med-card">
        
        <div class="med-image">
          <img 
            v-if="med.photo" 
            :src="'https://apipharmacie.pecatte.fr/images/' + med.photo" 
            alt="Photo médicament" 
          />
          <div v-else class="no-image">
            <span>💊</span>
            <p>Aucune image</p>
          </div>
          
          <span :class="['stock-badge', med.qte <= 5 ? 'low' : 'ok']">
            {{ med.qte <= 0 ? 'Rupture' : med.qte + ' en stock' }}
          </span>
        </div>
        
        <div class="med-info">
          <h3>{{ med.denomination || 'Produit sans nom' }}</h3>
          <p class="forme">{{ med.formepharmaceutique || 'Forme non précisée' }}</p>
          
          <div class="stock-controls">
            <button 
              @click="diminuerStock(med)" 
              :disabled="med.qte === 0" 
              class="btn-circle"
              title="Vente (-1)"
            >−</button>
            <span class="qte-display">{{ med.qte }}</span>
            <button 
              @click="augmenterStock(med)" 
              class="btn-circle"
              title="Livraison (+1)"
            >+</button>
          </div>

          <div class="card-actions">
            <button @click="allerVersModification(med.id)" class="btn-edit">
              Modifier
            </button>
            <button @click="retirerMedicament(med.id)" class="btn-delete" title="Supprimer définitivement">
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>Aucun médicament ne correspond à votre recherche.</p>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header & Recherche */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 20px;
}

.header-text h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
}

.header-text p {
  margin: 5px 0 0;
  color: #7f8c8d;
}

.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-wrapper input {
  width: 100%;
  padding: 14px 20px 14px 45px;
  border-radius: 12px;
  border: 1px solid #dfe6e9;
  background: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-wrapper input:focus {
  border-color: #27ae60;
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.1);
  outline: none;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
}

/* Grille */
.grid-stock {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
}

/* Carte Médicament */
.med-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border: 1px solid #f1f2f6;
}

.med-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.med-image {
  height: 200px;
  position: relative;
  background: #f9f9f9;
}

.med-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #bdc3c7;
}

.no-image span { font-size: 3rem; margin-bottom: 10px; }

.stock-badge {
  position: absolute;
  bottom: 15px;
  left: 15px;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stock-badge.ok { background: #e3f9eb; color: #27ae60; }
.stock-badge.low { background: #fff2f2; color: #e74c3c; animation: pulse 2s infinite; }

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.med-info { padding: 1.5rem; }

.med-info h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.forme {
  color: #95a5a6;
  font-size: 0.9rem;
  margin: 8px 0 20px;
}

/* Contrôles de stock */
.stock-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
  padding: 8px 15px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.btn-circle {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: none;
  background: white;
  color: #27ae60;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.btn-circle:hover:not(:disabled) {
  background: #27ae60;
  color: white;
}

.btn-circle:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qte-display {
  font-size: 1.1rem;
  font-weight: 800;
  color: #2c3e50;
}

/* Boutons d'action */
.card-actions {
  display: flex;
  gap: 12px;
}

.btn-edit {
  flex: 1;
  background: #f1f2f6;
  color: #2c3e50;
  border: none;
  padding: 10px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-edit:hover { background: #dfe4ea; }

.btn-delete {
  background: #fff2f2;
  color: #e74c3c;
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-delete:hover { background: #ffdada; }

.empty-state, .loader {
  text-align: center;
  padding: 5rem;
  color: #7f8c8d;
  font-size: 1.2rem;
}
</style>