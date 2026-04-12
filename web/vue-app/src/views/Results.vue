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
      <div class="results-title-row">
        <h2>Результаты</h2>
        <span v-if="frozen" class="frozen-badge">❄ Заморожены</span>
      </div>

      <div v-if="deadlineText" class="deadline-banner" :class="{ 'deadline-expired': deadlineExpired }">
        <span class="deadline-label">Прием результатов до: {{ deadlineText }}</span>
        <span class="deadline-value">{{ deadlineExpired ? 'Прием закрыт' : `Осталось: ${countdownText}` }}</span>
      </div>

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
import { ref, onMounted, onUnmounted } from 'vue'

const data = ref(null)
const loading = ref(true)
const hidden = ref(false)
const frozen = ref(false)
const deadlineText = ref('')
const deadlineMs = ref(null)
const countdownText = ref('')
const deadlineExpired = ref(false)
const serverNowMs = ref(Date.now())
const isLoggedIn = !!localStorage.getItem('user')
let pollTimer = null
let clockTimer = null

function formatDateTime(valueMs) {
  return new Date(valueMs).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

function updateCountdown() {
  if (!deadlineMs.value) {
    countdownText.value = ''
    deadlineExpired.value = false
    return
  }

  const diff = deadlineMs.value - serverNowMs.value
  if (diff <= 0) {
    deadlineExpired.value = true
    countdownText.value = '00:00:00'
    return
  }

  deadlineExpired.value = false
  const totalSec = Math.floor(diff / 1000)
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  countdownText.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

async function fetchResults() {
  try {
    const res = await fetch(`${window.location.origin}/api/results`, { credentials: 'include' })
    const json = await res.json()

    if (json.serverTime) {
      const parsedNow = new Date(json.serverTime).getTime()
      if (!Number.isNaN(parsedNow)) serverNowMs.value = parsedNow
    }

    if (json.deadline) {
      const parsedDeadline = new Date(json.deadline).getTime()
      if (!Number.isNaN(parsedDeadline)) {
        deadlineMs.value = parsedDeadline
        deadlineText.value = formatDateTime(parsedDeadline)
      }
    } else {
      deadlineMs.value = null
      deadlineText.value = ''
    }
    updateCountdown()

    if (json.hidden) {
      hidden.value = true
      data.value = null
      frozen.value = false
    } else {
      hidden.value = false
      data.value = json
      frozen.value = !!json.frozen
    }
  } catch {
    // silent
  }
}

onMounted(async () => {
  await fetchResults()
  loading.value = false
  pollTimer = setInterval(fetchResults, 5000)
  clockTimer = setInterval(() => {
    serverNowMs.value += 1000
    updateCountdown()
  }, 1000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  if (clockTimer) clearInterval(clockTimer)
})
</script>

<style scoped>
.results-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.frozen-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: #E8F4FD;
  color: #1976D2;
  border: 1px solid #BBDEFB;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.deadline-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  padding: 10px 12px;
  border: 1px solid #CBE2F9;
  background: #F5FAFF;
  border-radius: 10px;
}
.deadline-expired {
  border-color: #F5C2C2;
  background: #FFF6F6;
}
.deadline-label {
  color: #2F4D6A;
  font-size: 13px;
}
.deadline-value {
  color: #0B66C3;
  font-size: 13px;
  font-weight: 700;
}
.deadline-expired .deadline-label,
.deadline-expired .deadline-value {
  color: #B42318;
}
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
  gap: 8px;
  flex-wrap: wrap;
}
.results-header h1 {
  font-size: 17px;
  font-weight: 700;
  color: #000;
  letter-spacing: -0.3px;
  white-space: nowrap;
}
.header-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
@media (max-width: 600px) {
  .results-header { padding: 12px 16px; }
  .results-main { padding: 20px 12px; }
  .results-main h2 { font-size: 18px; }
  .results-table { font-size: 12px; }
  .btn-back { padding: 5px 10px; font-size: 12px; }
}
</style>
