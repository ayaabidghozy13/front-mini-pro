<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMedicaments, supprimerMedicament, modifierMedicament } from '../services/medicineService'
import { useRouter } from 'vue-router'

const router = useRouter()
const medicaments = ref([])// Liste complète des médicaments
const recherche = ref('')// Texte saisi dans la barre de recherche
const chargement = ref(true) // Indicateur de chargement API

// Charger les données depuis l'API
async function chargerDonnees() {
  chargement.value = true 
  try {
    medicaments.value = await getMedicaments()
  } catch (erreur) {
    console.error("Erreur de connexion à l'API", erreur)
  } finally {
    chargement.value = false
  }
}
// Au montage du composant, on lance la récupération des données
onMounted(() => {
  chargerDonnees()
})

// Filtrage intelligent 
const medicamentsFiltres = computed(() => {
  if (!recherche.value) return medicaments.value;
  
  return medicaments.value.filter(med => {
    const nom = med.denomination ? med.denomination.toLowerCase() : '';
    const forme = med.formepharmaceutique ? med.formepharmaceutique.toLowerCase() : '';
    return nom.includes(recherche.value.toLowerCase()) || forme.includes(recherche.value.toLowerCase());
  })
})
//supp med 
async function retirerMedicament(id) {
  if (confirm("Voulez-vous vraiment supprimer ce médicament du stock ?")) {
    await supprimerMedicament(id)
    await chargerDonnees()
  }
}

async function augmenterStock(medicament) {
  const medModifie = { ...medicament, qte: medicament.qte + 1 }
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
// Redirection vers la page de modification complète
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
        <div class="search-icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input v-model="recherche" type="text" placeholder="Rechercher un médicament..." />
      </div>
    </header>

    <div v-if="chargement" class="loader">
      <div class="spinner"></div>
      <p>Chargement de la pharmacie...</p>
    </div>

    <div v-else-if="medicamentsFiltres.length > 0" class="grid-stock">
      <div v-for="med in medicamentsFiltres" :key="med.id" class="med-card">
        
        <div class="med-image">
          <img 
            v-if="med.photo" 
            :src="'https://apipharmacie.pecatte.fr/images/' + med.photo" 
            alt="Photo médicament" 
          />
          <div v-else class="no-image">
            <div class="no-image-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#bdc3c7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 3h12a2 2 0 0 1 2 2v2H4V5a2 2 0 0 1 2-2Z"></path>
                <path d="M4 7h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"></path>
                <path d="M10 12h4"></path>
                <path d="M12 10v4"></path>
              </svg>
            </div>
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
            <button @click="diminuerStock(med)" :disabled="med.qte === 0" class="btn-circle">−</button>
            <span class="qte-display">{{ med.qte }}</span>
            <button @click="augmenterStock(med)" class="btn-circle">+</button>
          </div>

          <div class="card-actions">
            <button @click="allerVersModification(med.id)" class="btn-edit">Modifier</button>
            <button @click="retirerMedicament(med.id)" class="btn-delete">🗑</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>Aucun médicament ne correspond à votre recherche.</p>
      <button @click="recherche = ''" class="btn-clear">Effacer la recherche</button>
    </div>
  </div>
</template>

<style scoped>
.home-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 20px;
}

.header-text h1 { margin: 0; color: #2c3e50; font-size: 2.2rem; font-weight: 800; }
.header-text p { margin: 5px 0 0; color: #7f8c8d; font-weight: 500; }

.search-wrapper { position: relative; width: 100%; max-width: 400px; }
.search-icon-container {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  pointer-events: none;
}

.search-wrapper input {
  width: 100%;
  padding: 14px 20px 14px 48px;
  border-radius: 12px;
  border: 1px solid #dfe6e9;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-wrapper input:focus {
  border-color: #27ae60;
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.1);
  outline: none;
}

.grid-stock {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
}

.med-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border: 1px solid #f1f2f6;
  display: flex;
  flex-direction: column;
}

.med-card:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }

.med-image { height: 200px; position: relative; background: #f8fbf9; }
.med-image img { width: 100%; height: 100%; object-fit: contain; background: white; }

.no-image {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #bdc3c7;
}
.no-image-icon { margin-bottom: 10px; opacity: 0.6; }
.no-image p { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin: 0; }

.stock-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.stock-badge.ok { background: #e3f9eb; color: #27ae60; }
.stock-badge.low { background: #fff2f2; color: #e74c3c; animation: pulse 2s infinite; }

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.med-info { padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; }
.med-info h3 { margin: 0; font-size: 1.2rem; color: #2c3e50; text-overflow: ellipsis; overflow: hidden; }
.forme { color: #95a5a6; font-size: 0.9rem; margin: 8px 0 20px; }

.stock-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
  padding: 8px 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  margin-top: auto;
}

.btn-circle {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: white;
  color: #27ae60;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.btn-circle:hover:not(:disabled) { background: #27ae60; color: white; }
.btn-circle:disabled { opacity: 0.3; }

.qte-display { font-size: 1.1rem; font-weight: 800; color: #2c3e50; }

.card-actions { display: flex; gap: 10px; }
.btn-edit { flex: 1; background: #27ae60; color: white; border: none; padding: 10px; border-radius: 10px; font-weight: 700; cursor: pointer; }
.btn-edit:hover { background: #219150; }
.btn-delete { background: #fff2f2; color: #e74c3c; border: none; padding: 10px 15px; border-radius: 10px; cursor: pointer; }
.btn-delete:hover { background: #ffdada; }

.loader, .empty-state { text-align: center; padding: 5rem; color: #7f8c8d; }
.spinner {
  width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #27ae60;
  border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

.btn-clear { margin-top: 20px; background: none; border: 1px solid #27ae60; color: #27ae60; padding: 8px 20px; border-radius: 50px; cursor: pointer; font-weight: 600; }
</style>