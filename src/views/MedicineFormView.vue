<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ajouterMedicament, modifierMedicament, getMedicaments } from '../services/medicineService'

const route = useRoute()
const router = useRouter()

const medicamentFormulaire = ref({
  denomination: '',
  formepharmaceutique: '',
  qte: 0,
  photo: '' 
})

const estModeModification = ref(false)

onMounted(async () => {
  if (route.params.id) {
    estModeModification.value = true
    try {
      const tousLesMedocs = await getMedicaments()
      const medTrouve = tousLesMedocs.find(m => m.id == route.params.id)
      if (medTrouve) {
        medicamentFormulaire.value = { ...medTrouve }
        medicamentFormulaire.value.photo = ''; 
      }
    } catch (err) {
      console.error("Erreur chargement:", err)
    }
  }
})

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return; 
  
  const reader = new FileReader();
  reader.onload = () => { 
    medicamentFormulaire.value.photo = reader.result; 
  };
  reader.readAsDataURL(file); 
};

async function sauvegarder() {
  try {
    medicamentFormulaire.value.qte = parseInt(medicamentFormulaire.value.qte, 10);

    if (estModeModification.value) {
      await modifierMedicament(medicamentFormulaire.value)
    } else {
      await ajouterMedicament(medicamentFormulaire.value)
    }
    router.push('/') 
  } catch (err) {
    alert("Erreur lors de la sauvegarde. Vérifiez votre API perso.")
  }
}

function annuler() {
  router.push('/')
}
</script>

<template>
  <div class="form-wrapper">
    <div class="form-card">
      <header class="form-header">
        <div class="icon-box">{{ estModeModification ? '✎' : '✚' }}</div>
        <h2>{{ estModeModification ? 'Éditer le produit' : 'Nouveau médicament' }}</h2>
      </header>

      <form @submit.prevent="sauvegarder" class="modern-form">
        <div class="input-group">
          <label>Dénomination</label>
          <input v-model="medicamentFormulaire.denomination" type="text" placeholder="Ex: Doliprane 500mg" required />
        </div>

        <div class="input-group">
          <label>Forme Pharmaceutique</label>
          <input v-model="medicamentFormulaire.formepharmaceutique" type="text" placeholder="Ex: Gélule, Sirop..." required />
        </div>

        <div class="row">
          <div class="input-group">
            <label>Quantité initiale</label>
            <input v-model.number="medicamentFormulaire.qte" type="number" min="0" required />
          </div>
          
          <div class="input-group">
            <label>Photo</label>
            <div class="file-upload">
              <input id="photo" @change="handleFileUpload" type="file" accept="image/*" />
              <span>{{ medicamentFormulaire.photo ? 'Photo sélectionnée ✓' : 'Choisir un fichier' }}</span>
            </div>
          </div>
        </div>

        <div class="form-footer">
          <button type="button" @click="annuler" class="btn-secondary">Annuler</button>
          <button type="submit" class="btn-primary">Confirmer</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-wrapper { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
.form-card { background: white; width: 100%; max-width: 550px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); padding: 40px; }
.form-header { text-align: center; margin-bottom: 30px; }
.icon-box { 
  width: 60px; height: 60px; background: #e3f9eb; color: #27ae60; 
  border-radius: 15px; display: flex; align-items: center; justify-content: center; 
  font-size: 1.5rem; margin: 0 auto 15px;
}
.modern-form .input-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
.modern-form label { font-size: 0.9rem; font-weight: 600; color: #636e72; }
.modern-form input { 
  padding: 12px; border: 2px solid #f1f2f6; border-radius: 10px; font-size: 1rem;
  transition: all 0.3s;
}
.modern-form input:focus { border-color: #27ae60; outline: none; background: #fdfdfd; }

.row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.file-upload { 
  position: relative; border: 2px dashed #dfe6e9; border-radius: 10px; 
  height: 45px; display: flex; align-items: center; justify-content: center;
  background: #f8f9fa;
}
.file-upload input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; }
.file-upload span { color: #27ae60; font-size: 0.8rem; font-weight: 500; }

.form-footer { display: flex; gap: 15px; margin-top: 30px; }
.btn-primary { flex: 2; background: #27ae60; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; cursor: pointer; transition: 0.3s; }
.btn-primary:hover { background: #219150; }
.btn-secondary { flex: 1; background: #f1f2f6; color: #636e72; border: none; padding: 15px; border-radius: 12px; font-weight: bold; cursor: pointer; }
</style>../services/medicineService