<template>
  <div class="tasks-page">
    <header class="tasks-header">
      <h1>Church-Turing Thesis</h1>
      <div class="header-right">
        <router-link to="/results" class="btn-nav">Результаты</router-link>
        <router-link v-if="isLoggedIn" to="/dashboard" class="btn-nav">Назад</router-link>
        <router-link v-else to="/" class="btn-nav">На главную</router-link>
      </div>
    </header>

    <main class="tasks-main">
      <h2>Задания</h2>

      <div v-if="loading" class="loading-spinner">Загрузка...</div>

      <div v-else-if="hidden" class="empty-state">
        <p>Задания пока недоступны</p>
      </div>

      <div v-else-if="tasks.length" class="tasks-list">
        <div v-for="task in tasks" :key="task.id" class="task-card">
          <div class="task-header">
            <span class="task-number">{{ task.number }}</span>
            <h3 class="task-name">{{ task.name }}</h3>
            <span class="task-points">{{ task.maxPoints }} баллов</span>
          </div>
          <p v-if="task.description" class="task-description">{{ task.description }}</p>
          <a v-if="task.link" :href="task.link" target="_blank" rel="noopener" class="task-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Подробное описание
          </a>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Заданий пока нет</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const tasks = ref([])
const loading = ref(true)
const hidden = ref(false)
const isLoggedIn = !!localStorage.getItem('user')
let pollTimer = null

async function fetchTasks() {
  try {
    const res = await fetch(`${window.location.origin}/api/tasks`, { credentials: 'include' })
    const json = await res.json()
    if (json.hidden) {
      hidden.value = true
      tasks.value = []
    } else {
      hidden.value = false
      tasks.value = json
    }
  } catch {
    // silent
  }
}

onMounted(async () => {
  await fetchTasks()
  loading.value = false
  pollTimer = setInterval(fetchTasks, 15000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<style scoped>
.tasks-page {
  min-height: 100vh;
  background: #fff;
}

.tasks-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid #E5E5E5;
}
.tasks-header h1 {
  font-size: 17px;
  font-weight: 700;
  color: #000;
  letter-spacing: -0.3px;
}
.header-right {
  display: flex;
  gap: 8px;
}
.btn-nav {
  padding: 6px 14px;
  border: 1px solid #E5E5E5;
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  color: #333;
  text-decoration: none;
  transition: all 0.15s;
}
.btn-nav:hover {
  background: #F5F5F5;
  border-color: #CCC;
}

.tasks-main {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px;
}
.tasks-main h2 {
  font-size: 20px;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
  letter-spacing: -0.3px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  border: 1px solid #E5E5E5;
  border-radius: 10px;
  padding: 18px 20px;
  transition: border-color 0.15s;
}
.task-card:hover {
  border-color: #CCC;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-number {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F0F0F0;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  color: #333;
  flex-shrink: 0;
}

.task-name {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  flex: 1;
  margin: 0;
}

.task-points {
  font-size: 13px;
  font-weight: 500;
  color: #8E8E93;
  background: #F0F0F0;
  padding: 3px 10px;
  border-radius: 10px;
  white-space: nowrap;
  flex-shrink: 0;
}

.task-description {
  margin: 12px 0 0;
  padding-left: 42px;
  font-size: 14px;
  line-height: 1.6;
  color: #444;
  white-space: pre-wrap;
}

.task-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  margin-left: 42px;
  padding: 6px 14px;
  background: #F0F0F0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #0088CC;
  text-decoration: none;
  transition: all 0.15s;
}
.task-link:hover {
  background: #E5E5E5;
  color: #006AA3;
}

.empty-state {
  padding: 48px 0;
  text-align: center;
  font-size: 15px;
  color: #8E8E93;
}
.loading-spinner {
  padding: 48px 0;
  text-align: center;
  font-size: 15px;
  color: #8E8E93;
}
</style>
