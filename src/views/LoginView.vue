<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleEnterEntry = (event) => {
  if (event.key === 'Enter') {
   
    localStorage.setItem('isLoggedIn', 'true')
    router.push('/inventory')
  }
}

onMounted(() => {
  // If already logged in before, skip this page automatically
  if (localStorage.getItem('isLoggedIn') === 'true') {
    router.push('/inventory')
    return
  }
  window.addEventListener('keydown', handleEnterEntry)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEnterEntry)
})
</script>

<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="logo">✚</div>
      <h1>PharmaGestion</h1>
      <p>Bienvenue dans votre espace sécurisé</p>
      <div class="hint">
        Appuyez sur <span class="key">Entrée</span> pour commencer
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #27ae60;
}
.login-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
.logo { font-size: 3rem; color: #27ae60; margin-bottom: 10px; }
.hint { margin-top: 25px; color: #95a5a6; font-size: 1rem; }
.key { 
  background: #f1f2f6; 
  padding: 4px 10px; 
  border-radius: 6px; 
  border: 1px solid #ddd;
  font-weight: bold;
  color: #2c3e50;
}
</style>