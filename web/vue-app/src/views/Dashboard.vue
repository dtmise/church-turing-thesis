<template>
  <div class="dashboard-wrapper">
    <header class="dashboard-header">
      <h1>Church-Turing Thesis</h1>
      <div class="user-info">
        <span class="user-name-display">{{ auth.user?.fullName }}</span>
        <button class="btn-logout" @click="onLogout">Выйти</button>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="blocks-container">
        <!-- Profile -->
        <div class="info-block profile-block">
          <div class="block-icon">👤</div>
          <h2>Мой профиль</h2>
          <div v-if="profile" class="profile-info">
            <p><strong>ФИО:</strong> <span>{{ profile.fullName }}</span></p>
            <p><strong>Группа:</strong> <span>{{ profile.group }}</span></p>
            <p><strong>Email:</strong> <span>{{ profile.email }}</span></p>
            <p><strong>Роль:</strong> <span>{{ roleText }}</span></p>
          </div>
          <div v-else class="loading-spinner">Загрузка...</div>
          <button class="btn-edit" @click="openEditModal">Редактировать</button>
        </div>

        <!-- Team -->
        <div class="info-block team-block">
          <div class="block-icon">👥</div>
          <h2>Моя команда</h2>
          <div v-if="myTeam" class="team-details">
            <h3>{{ myTeam.name }}</h3>
            <div class="team-stats">
              <p><strong>Участников:</strong> {{ myTeam.membersCount }}</p>
            </div>
            <span class="team-badge">{{ profile?.role === 'captain' ? 'Вы капитан' : 'Вы участник' }}</span>
          </div>
          <div v-else-if="!loading" class="empty-state">
            <p>🏠 Вы пока не состоите в команде</p>
          </div>
          <div v-else class="loading-spinner">Загрузка...</div>
        </div>

        <!-- News -->
        <div class="info-block news-block">
          <div class="block-icon">📰</div>
          <h2>Новости</h2>
          <div v-if="news.length" class="news-list">
            <div v-for="item in news" :key="item.id" class="news-card">
              <div class="news-header">
                <h3>{{ item.title }}</h3>
                <span class="news-date">{{ formatDate(item.publishedAt) }}</span>
              </div>
              <p class="news-content">{{ item.content }}</p>
            </div>
          </div>
          <div v-else-if="!loading" class="empty-state">
            <p>📭 Новостей пока нет</p>
          </div>
          <div v-else class="loading-spinner">Загрузка...</div>
        </div>
      </div>
    </main>

    <!-- Edit modal -->
    <div v-if="editOpen" class="modal" style="display:flex;" @click.self="editOpen = false">
      <div class="modal-content">
        <span class="close" @click="editOpen = false">&times;</span>

        <h3>Редактировать профиль</h3>
        <form @submit.prevent="saveProfile">
          <div class="form-group">
            <label>ФИО</label>
            <input v-model="editForm.fullName" type="text" required>
          </div>
          <div class="form-group">
            <label>Группа</label>
            <input v-model="editForm.group" type="text" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="editForm.email" type="email" required>
          </div>
          <button type="submit" class="btn-primary">Сохранить</button>
        </form>

        <hr class="modal-divider">

        <h3>Сменить пароль</h3>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label>Текущий пароль</label>
            <input v-model="pwForm.oldPassword" type="password" required>
          </div>
          <div class="form-group">
            <label>Новый пароль</label>
            <input v-model="pwForm.newPassword" type="password" required minlength="4">
          </div>
          <button type="submit" class="btn-primary">Сменить пароль</button>
        </form>

        <template v-if="profile?.role === 'captain'">
          <hr class="modal-divider">
          <h3>Название команды</h3>
          <form @submit.prevent="changeTeamName">
            <div class="form-group">
              <label>Новое название</label>
              <input v-model="teamNameEdit" type="text" required>
            </div>
            <button type="submit" class="btn-primary">Сохранить</button>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../composables/auth'
import { api } from '../composables/api'
import { useNotification } from '../composables/notification'

const router = useRouter()
const { show: notify } = useNotification()

const loading = ref(true)
const profile = ref(null)
const myTeam = ref(null)
const news = ref([])

// Edit modal state
const editOpen = ref(false)
const editForm = ref({ fullName: '', group: '', email: '' })
const pwForm = ref({ oldPassword: '', newPassword: '' })
const teamNameEdit = ref('')

const roleText = computed(() => {
  if (!profile.value) return ''
  return profile.value.role === 'captain' ? '👑 Капитан команды' : '👥 Участник команды'
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    const pad = n => String(n).padStart(2, '0')
    return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch { return '' }
}

async function loadData() {
  loading.value = true
  try {
    const [p, teams, n] = await Promise.all([
      api.getProfile(),
      api.getTeams(),
      api.getNews()
    ])
    profile.value = p
    auth.user = p
    localStorage.setItem('user', JSON.stringify(p))
    news.value = n || []

    if (p?.team?.id) {
      myTeam.value = teams.find(t => t.id === p.team.id) || null
    }
  } catch (e) {
    notify(e.message || 'Ошибка загрузки', 'error')
  } finally {
    loading.value = false
  }
}

function openEditModal() {
  if (profile.value) {
    editForm.value = {
      fullName: profile.value.fullName,
      group: profile.value.group,
      email: profile.value.email
    }
    pwForm.value = { oldPassword: '', newPassword: '' }
    if (myTeam.value) teamNameEdit.value = myTeam.value.name
  }
  editOpen.value = true
}

async function saveProfile() {
  try {
    await api.updateProfile({ fullName: editForm.value.fullName, group: editForm.value.group })
    await api.updateEmail(editForm.value.email)
    await loadData()
    notify('Профиль обновлён!', 'success')
  } catch (e) {
    notify(e.message || 'Ошибка обновления', 'error')
  }
}

async function changePassword() {
  try {
    await api.updatePassword(pwForm.value.oldPassword, pwForm.value.newPassword)
    pwForm.value = { oldPassword: '', newPassword: '' }
    notify('Пароль обновлён!', 'success')
  } catch (e) {
    notify(e.message || 'Ошибка смены пароля', 'error')
  }
}

async function changeTeamName() {
  try {
    await api.updateTeamName(teamNameEdit.value)
    await loadData()
    notify('Название обновлено!', 'success')
  } catch (e) {
    notify(e.message || 'Ошибка обновления', 'error')
  }
}

function onLogout() {
  auth.logout()
  router.push('/')
}

onMounted(loadData)
</script>

<style scoped>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  max-height: 85vh;
  overflow-y: auto;
}
.modal-divider {
  margin: 24px 0;
  border: none;
  border-top: 1px solid var(--border);
}
</style>
