<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '../types/user'
import usersData from '../data/user.json'

// Завантажуємо дані та кастуємо до масиву типу User
const users = ref<User[]>(usersData as User[])

// Стани фільтрації та сортування
const filterGender = ref<'All' | 'Female' | 'Male'>('All')
const filterAge18Plus = ref<boolean>(false)
const sortBy = ref<'none' | 'nameAsc' | 'nameDesc' | 'ageAsc' | 'ageDesc'>('none')

// Стан відкритих секцій "About me"
const visibleDetails = ref<Record<number, boolean>>({})

const toggleDetails = (index: number) => {
  visibleDetails.value[index] = !visibleDetails.value[index]
}

// Обчислюваний клас в залежності від віку (:class)
const getAgeClass = (age: number) => {
  if (age < 18) return 'minor'
  if (age <= 30) return 'young'
  if (age <= 50) return 'adult'
  return 'senior'
}

// Комбінована логіка фільтрації та сортування
const processedUsers = computed(() => {
  let result = [...users.value]

  // Фільтрація по статі
  if (filterGender.value !== 'All') {
    result = result.filter(u => u.gender === filterGender.value)
  }

  // Фільтрація по віку 18+
  if (filterAge18Plus.value) {
    result = result.filter(u => u.dob.age >= 18)
  }

  // Сортування
  if (sortBy.value === 'nameAsc') {
    result.sort((a, b) => `${a.name.first} ${a.name.last}`.localeCompare(`${b.name.first} ${b.name.last}`))
  } else if (sortBy.value === 'nameDesc') {
    result.sort((a, b) => `${b.name.first} ${b.name.last}`.localeCompare(`${a.name.first} ${a.name.last}`))
  } else if (sortBy.value === 'ageAsc') {
    result.sort((a, b) => a.dob.age - b.dob.age)
  } else if (sortBy.value === 'ageDesc') {
    result.sort((a, b) => b.dob.age - a.dob.age)
  }

  return result
})

// Скидання всіх фільтрів
const resetAll = () => {
  filterGender.value = 'All'
  filterAge18Plus.value = false
  sortBy.value = 'none'
}
</script>

<template>
  <div class="container">
    <!-- Тулбар фільтрації та сортування -->
    <div class="toolbar">
      <div class="group">
        <span>Стать:</span>
        <button :class="{ active: filterGender === 'All' }" @click="filterGender = 'All'">Всі</button>
        <button :class="{ active: filterGender === 'Male' }" @click="filterGender = 'Male'">Чоловіки</button>
        <button :class="{ active: filterGender === 'Female' }" @click="filterGender = 'Female'">Жінки</button>
      </div>

      <div class="group">
        <span>Вік:</span>
        <button :class="{ active: !filterAge18Plus }" @click="filterAge18Plus = false">Всі</button>
        <button :class="{ active: filterAge18Plus }" @click="filterAge18Plus = true">18 +</button>
      </div>

      <div class="group">
        <span>Сортування:</span>
        <button :class="{ active: sortBy === 'nameAsc' }" @click="sortBy = 'nameAsc'">Ім’я ↑</button>
        <button :class="{ active: sortBy === 'nameDesc' }" @click="sortBy = 'nameDesc'">Ім’я ↓</button>
        <button :class="{ active: sortBy === 'ageAsc' }" @click="sortBy = 'ageAsc'">Вік ↑</button>
        <button :class="{ active: sortBy === 'ageDesc' }" @click="sortBy = 'ageDesc'">Вік ↓</button>
      </div>

      <button class="reset-btn" @click="resetAll">Очистити все</button>
    </div>

    <!-- Перевірка порожнього списку (v-if) -->
    <div v-if="processedUsers.length === 0" class="empty-list">
      Список юзерів пустий
    </div>

    <!-- Список користувачів (v-else) -->
    <div v-else class="users-grid">
      <div 
        v-for="(user, index) in processedUsers" 
        :key="user.email" 
        class="user-card"
        :class="getAgeClass(user.dob.age)"
      >
        <!-- Лівий сайдбар -->
        <div class="sidebar">
          <img :src="user.picture" :alt="`${user.name.first} ${user.name.last}`" class="avatar" />
          <h2 class="main-name">{{ user.name.title }}. {{ user.name.first }} {{ user.name.last }}</h2>
          <div class="badges">
            <span class="badge">{{ user.gender }}</span>
            <span v-if="user.dob.age >= 18" class="badge">{{ user.dob.age }} років</span>
          </div>
          <div class="short-info">
            <p>📍 {{ user.location.city }}, {{ user.location.country }}</p>
            <p>✉️ {{ user.email }}</p>
            <p>📞 {{ user.phone }}</p>
          </div>
        </div>

        <!-- Основна інформація справа -->
        <div class="main-content">
          <!-- Секція "About me" із перемикачем v-show -->
          <div class="accordion-item">
            <div class="accordion-header" @click="toggleDetails(index)">
              <span>👤 About me</span>
              <span class="arrow">{{ visibleDetails[index] ? '▲' : '▼' }}</span>
            </div>
            <div v-show="visibleDetails[index]" class="accordion-body">
              {{ user.details }}
            </div>
          </div>

          <!-- Персональні дані -->
          <div class="info-block">
            <h3>📋 Personal Information</h3>
            <div class="grid-fields">
              <div><strong>Full name:</strong> {{ user.name.title }} {{ user.name.first }} {{ user.name.last }}</div>
              <div><strong>Gender:</strong> {{ user.gender }}</div>
              <div><strong>Date of birth:</strong> {{ user.dob.date }} (вік {{ user.dob.age }})</div>
              <div><strong>Email:</strong> {{ user.email }}</div>
              <div><strong>Phone:</strong> {{ user.phone }}</div>
              <div><strong>Cell:</strong> {{ user.cell }}</div>
            </div>
          </div>

          <!-- Локація -->
          <div class="info-block">
            <h3>📍 Location</h3>
            <div class="grid-fields">
              <div><strong>Street:</strong> {{ user.location.street }}</div>
              <div><strong>City:</strong> {{ user.location.city }}</div>
              <div><strong>State:</strong> {{ user.location.state }}</div>
              <div><strong>Country:</strong> {{ user.location.country }}</div>
              <div><strong>Postcode:</strong> {{ user.location.postcode }}</div>
              <div><strong>Timezone:</strong> {{ user.location.timezone }}</div>
            </div>
          </div>

          <!-- Хоббі (v-for) -->
          <div class="info-block">
            <h3>⭐ Hobbies</h3>
            <div class="hobbies-list">
              <span v-for="hobby in user.hobbies" :key="hobby" class="hobby-tag">
                {{ hobby }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  font-family: 'Inter', sans-serif;
  color: #2d3748;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  background: #f7fafc;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 25px;
  align-items: center;
  border: 1px solid #e2e8f0;
}
.group {
  display: flex;
  align-items: center;
  gap: 5px;
}
.group span {
  font-weight: 600;
  margin-right: 5px;
  font-size: 14px;
}
button {
  background: #fff;
  border: 1px solid #cbd5e0;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
button:hover {
  background: #edf2f7;
}
button.active {
  background: #42b883;
  color: white;
  border-color: #42b883;
}
.reset-btn {
  background: #feb2b2;
  color: #9b2c2c;
  border: none;
  font-weight: 600;
  margin-left: auto;
}
.reset-btn:hover {
  background: #fc8181;
}
.users-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.user-card {
  display: grid;
  grid-template-columns: 300px 1fr;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-left: 8px solid #cbd5e0;
  overflow: hidden;
}
.user-card.minor { border-left-color: #63b3ed; background-color: #f0f8ff; }
.user-card.young { border-left-color: #48bb78; background-color: #f0fff4; }
.user-card.adult { border-left-color: #ecc94b; background-color: #fffff0; }
.user-card.senior { border-left-color: #ed8936; background-color: #fffaf0; }
.sidebar {
  padding: 25px;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  border-radius: 12px;
  object-fit: cover;
}
.main-name {
  font-size: 22px;
  margin: 15px 0 10px 0;
}
.badges {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}
.badge {
  background: #e2e8f0;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
.short-info {
  text-align: left;
  width: 100%;
  font-size: 14px;
  line-height: 1.6;
}
.main-content {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.info-block h3 {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 5px;
  margin-bottom: 10px;
  font-size: 16px;
  color: #4a5568;
}
.grid-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  font-size: 14px;
}
.accordion-item {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
}
.accordion-header {
  padding: 10px 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  background: #edf2f7;
}
.accordion-body {
  padding: 15px;
  font-size: 14px;
  line-height: 1.5;
}
.hobbies-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.hobby-tag {
  background: #ebf8ff;
  color: #2b6cb0;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}
.empty-list {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #718096;
  background: #edf2f7;
  border-radius: 8px;
}
</style>
