<script setup lang="ts">
import Users from './components/Users.vue'
</script>

<template>
  <main>
    <h1 class="title">Лабораторна робота №3: Списки користувачів</h1>
    <Users />
  </main>
</template>

<style scoped>
main {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}
.title {
  text-align: center;
  margin-bottom: 40px;
  color: #2d3748;
}
</style>
