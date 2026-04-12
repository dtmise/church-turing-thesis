<template>
  <div class="results-page">
    <header class="results-header">
      <h1>Church-Turing Thesis</h1>
      <div class="header-right">
        <router-link to="/tasks" class="btn-back">Задания</router-link>
        <router-link v-if="isLoggedIn" to="/dashboard" class="btn-back">Назад</router-link>
        <router-link v-else to="/" class="btn-back">На главную</router-link>
      </div>
    </header>

    <main class="results-main">
      <h2>Результаты</h2>

      <div v-if="loading" class="loading-spinner">Загрузка...</div>

      <div v-else-if="hidden" class="empty-state">
        <p>Результаты пока недоступны</p>
      </div>

      <div v-else-if="data && data.tasks.length" class="results-table-wrap">
        <table class="results-table">
          <thead>
            <tr>
              <th class="col-place">#</th>
              <th class="col-team">Команда</th>
              <th v-for="task in data.tasks" :key="task.id" class="col-task" :title="task.name">
                {{ task.number }}
              </th>
              <th class="col-total">Σ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in data.rows" :key="row.teamId" :class="{ 'row-top': idx < 3 }">
              <td class="col-place">
                <span :class="['place-badge', `place-${idx + 1}`]">{{ idx + 1 }}</span>
              </td>
              <td class="col-team">{{ row.teamName }}</td>
              <td v-for="(pts, ti) in row.scores" :key="ti" class="col-task">
                <span :class="{ 'score-max': pts === data.tasks[ti].maxPoints && pts > 0, 'score-zero': pts === 0 }">{{ pts }}</span>
              </td>
              <td class="col-total">{{ row.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <p>Результатов пока нет</p>
      </div>

      <div v-if="data && data.tasks.length" class="legend">
        <h3>Задания</h3>
        <div class="legend-list">
          <div v-for="task in data.tasks" :key="task.id" class="legend-item">
            <span class="legend-number">{{ task.number }}</span>
            <span class="legend-name">{{ task.name }}</span>
            <span class="legend-max">макс. {{ task.maxPoints }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const data = ref(null)
const loading = ref(true)
const hidden = ref(false)
const isLoggedIn = !!localStorage.getItem('user')

onMounted(async () => {
  try {
    const res = await fetch(`${window.location.origin}/api/results`, { credentials: 'include' })
    const json = await res.json()
    if (json.hidden) {
      hidden.value = true
    } else {
      data.value = json
    }
  } catch {
    // silent
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.results-page {
  min-height: 100vh;
  background: #fff;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid #E5E5E5;
}
.results-header h1 {
  font-size: 17px;
  font-weight: 700;
  color: #000;
  letter-spacing: -0.3px;
}
.header-right {
  display: flex;
  gap: 8px;
}
.btn-back {
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
.btn-back:hover {
  background: #F5F5F5;
  border-color: #CCC;
}

.results-main {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
}
.results-main h2 {
  font-size: 20px;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
  letter-spacing: -0.3px;
}

.results-table-wrap {
  overflow-x: auto;
  border: 1px solid #E5E5E5;
  border-radius: 10px;
}
.results-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.results-table th {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #8E8E93;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 10px;
  border-bottom: 1px solid #E5E5E5;
  background: #FAFAFA;
  white-space: nowrap;
}
.results-table td {
  padding: 10px;
  border-bottom: 1px solid #F0F0F0;
  text-align: center;
  vertical-align: middle;
}
.results-table tbody tr:last-child td {
  border-bottom: none;
}
.results-table tbody tr:hover {
  background: #F9F9F9;
}

.col-place {
  width: 40px;
}
.col-team {
  text-align: left !important;
  font-weight: 500;
  color: #000;
  white-space: nowrap;
}
.col-task {
  min-width: 44px;
}
.col-total {
  font-weight: 700;
  color: #000;
  min-width: 50px;
}

.place-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  background: #F0F0F0;
}
.place-1 { background: #FFD700; color: #000; }
.place-2 { background: #C0C0C0; color: #000; }
.place-3 { background: #CD7F32; color: #fff; }

.row-top td {
  background: #FFFBF0;
}
.row-top:hover td {
  background: #FFF6E0 !important;
}

.score-max {
  color: #34C759;
  font-weight: 600;
}
.score-zero {
  color: #CCC;
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

.legend {
  margin-top: 28px;
}
.legend h3 {
  font-size: 15px;
  font-weight: 600;
  color: #000;
  margin-bottom: 10px;
}
.legend-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}
.legend-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F0F0F0;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  color: #333;
  flex-shrink: 0;
}
.legend-name {
  color: #000;
  flex: 1;
}
.legend-max {
  font-size: 12px;
  color: #8E8E93;
  flex-shrink: 0;
}
</style>
