<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="app-container">
    <NavBar />
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
/* Reset global pour éviter les marges bizarres */
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif; /* Ou Arial si tu préfères */
  background-color: #f8fbf9; /* Un blanc très légèrement vert pour le côté médical */
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
}

.main-content {
  min-height: calc(100vh - 80px);
}
</style>