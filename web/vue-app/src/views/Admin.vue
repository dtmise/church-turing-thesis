<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-title">Админ-панель</h1>
      </div>
      <nav class="sidebar-nav">
        <button :class="['nav-item', { active: tab === 'news' }]" @click="tab = 'news'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
          Новости
        </button>
        <button :class="['nav-item', { active: tab === 'users' }]" @click="tab = 'users'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Пользователи
        </button>
        <button :class="['nav-item', { active: tab === 'teams' }]" @click="tab = 'teams'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Команды
        </button>
        <button :class="['nav-item', { active: tab === 'contacts' }]" @click="tab = 'contacts'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Контакты
        </button>
        <button :class="['nav-item', { active: tab === 'tasks' }]" @click="tab = 'tasks'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          Задания
        </button>
        <button :class="['nav-item', { active: tab === 'scores' }]" @click="tab = 'scores'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
          Результаты
        </button>
        <button :class="['nav-item', { active: tab === 'pipeline' }]" @click="tab = 'pipeline'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Pipeline
        </button>
      </nav>
      <div class="sidebar-footer">
        <router-link to="/dashboard" class="nav-item nav-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
          Назад
        </router-link>
        <button class="nav-item nav-logout" @click="onLogout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Выйти
        </button>
      </div>
    </aside>

    <!-- Content -->
    <div class="admin-content">
      <!-- News -->
      <div v-if="tab === 'news'" class="content-section">
        <div class="content-header">
          <h2>Новости</h2>
          <button class="btn-add" @click="openCreateNews">+ Добавить</button>
        </div>
        <div class="content-divider"></div>
        <div v-if="news.length" class="content-list">
          <div v-for="(item, i) in news" :key="item.id" class="content-row">
            <div class="row-main">
              <span class="row-title">{{ item.title }}</span>
              <span class="row-caption">{{ item.content }}</span>
            </div>
            <div class="row-right">
              <span class="row-date">{{ formatDate(item.publishedAt) }}</span>
              <div class="row-actions">
                <button class="btn-row-action" @click="openEditNews(item)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
                <button class="btn-row-action btn-row-delete" @click="confirmDeleteNews(item)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
            <div v-if="i < news.length - 1" class="row-separator"></div>
          </div>
        </div>
        <div v-else class="content-empty">Новостей пока нет</div>
      </div>

      <!-- Users -->
      <div v-if="tab === 'users'" class="content-section">
        <div class="content-header">
          <h2>Пользователи</h2>
          <span class="header-count">{{ users.length }}</span>
        </div>
        <div class="content-divider"></div>
        <div v-if="users.length" class="content-list">
          <div v-for="(u, i) in users" :key="u.id" class="content-row">
            <div class="row-main">
              <span class="row-title">{{ u.fullName }}</span>
              <span class="row-caption">{{ u.group }} · {{ u.email }}</span>
            </div>
            <div class="row-right">
              <button
                v-if="u.id !== auth.user.id"
                class="badge btn-admin-toggle"
                :class="u.isAdmin ? 'btn-admin-revoke' : 'btn-admin-promote'"
                @click="toggleAdmin(u)"
              >{{ u.isAdmin ? 'Разжаловать' : 'Сделать админом' }}</button>
              <button v-if="u.id !== auth.user.id" class="btn-row-action btn-row-delete" @click="confirmDeleteUser(u)">Удалить</button>
              <span v-if="u.isAdmin" class="badge badge-admin">admin</span>
              <span v-if="u.role" class="badge badge-role">{{ u.role }}</span>
              <span v-if="!u.teamId" class="badge badge-noteam">без команды</span>
            </div>
            <div v-if="i < users.length - 1" class="row-separator"></div>
          </div>
        </div>
        <div v-else class="content-empty">Нет пользователей</div>
      </div>

      <!-- Teams -->
      <div v-if="tab === 'teams'" class="content-section">
        <div class="content-header">
          <h2>Команды</h2>
          <span class="header-count">{{ teams.length }}</span>
        </div>
        <div class="content-divider"></div>
        <div v-if="teams.length" class="content-list">
          <div v-for="(t, i) in teams" :key="t.id" class="team-block">
            <div class="content-row team-row-header">
              <div class="row-main">
                <span class="row-title">{{ t.name }}</span>
                <span class="row-caption">{{ t.members.length }} участник{{ t.members.length === 1 ? '' : t.members.length < 5 ? 'а' : 'ов' }} · {{ t.score }} очков</span>
              </div>
              <div class="row-actions">
                <button class="btn-row-action btn-row-delete" @click="confirmDeleteTeam(t)">Удалить</button>
              </div>
            </div>
            <div v-if="t.members.length" class="team-members-list">
              <div v-for="m in t.members" :key="m.id" class="member-item">
                <span class="member-name">{{ m.fullName }}</span>
                <span class="member-meta">{{ m.group }}</span>
                <span class="member-meta">{{ m.email }}</span>
                <span v-if="m.role === 'captain'" class="badge badge-captain">Капитан</span>
              </div>
            </div>
            <div v-if="i < teams.length - 1" class="row-separator"></div>
          </div>
        </div>
        <div v-else class="content-empty">Нет команд</div>
      </div>

      <!-- Contacts -->
      <div v-if="tab === 'contacts'" class="content-section">
        <div class="content-header">
          <h2>Контакты</h2>
          <span class="header-count">{{ contacts.length }}</span>
        </div>
        <div class="content-divider"></div>
        <div v-if="contacts.length" class="contacts-table-wrap">
          <table class="contacts-table">
            <thead>
              <tr>
                <th>Telegram</th>
                <th>VK</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in contacts" :key="c.id">
                <td>
                  <a v-if="c.telegram" :href="tgLink(c.telegram)" target="_blank" rel="noopener" class="contact-link contact-link-tg">{{ c.telegram }}</a>
                  <span v-else class="contact-empty">—</span>
                </td>
                <td>
                  <a v-if="c.vk" :href="vkLink(c.vk)" target="_blank" rel="noopener" class="contact-link contact-link-vk">{{ c.vk }}</a>
                  <span v-else class="contact-empty">—</span>
                </td>
                <td class="contact-date">{{ formatDate(c.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="content-empty">Нет контактов</div>
      </div>

      <!-- Tasks -->
      <div v-if="tab === 'tasks'" class="content-section">
        <div class="content-header">
          <h2>Задания</h2>
          <span class="header-count">{{ tasks.length }}</span>
          <button class="btn-add" @click="openCreateTask">+ Добавить</button>
        </div>
        <div class="content-divider"></div>
        <div v-if="tasks.length" class="content-list">
          <div v-for="(t, i) in tasks" :key="t.id" class="content-row">
            <div class="row-main">
              <span class="row-title">{{ t.number }}. {{ t.name }}</span>
              <span class="row-caption">{{ t.description || 'Без описания' }} · макс. {{ t.maxPoints }} баллов</span>
            </div>
            <div class="row-right">
              <div class="row-actions">
                <button class="btn-row-action" @click="openEditTask(t)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
                <button class="btn-row-action btn-row-delete" @click="confirmDeleteTask(t)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
            <div v-if="i < tasks.length - 1" class="row-separator"></div>
          </div>
        </div>
        <div v-else class="content-empty">Заданий пока нет</div>
      </div>

      <!-- Scores -->
      <div v-if="tab === 'scores'" class="content-section">
        <div class="content-header">
          <h2>Результаты</h2>
        </div>
        <div class="content-divider"></div>

        <!-- Visibility toggles -->
        <div class="settings-toggles">
          <label class="toggle-row" @click="toggleTasksVisible">
            <span class="toggle-track" :class="{ 'toggle-on': tasksVisible }"><span class="toggle-thumb"></span></span>
            <span class="toggle-label">Задания видны всем</span>
          </label>
          <label class="toggle-row" @click="toggleResultsVisible">
            <span class="toggle-track" :class="{ 'toggle-on': resultsVisible }"><span class="toggle-thumb"></span></span>
            <span class="toggle-label">Результаты видны всем</span>
          </label>
          <label class="toggle-row" @click="toggleFreeze">
            <span class="toggle-track" :class="{ 'toggle-on': resultsFrozen, 'toggle-freeze': true }"><span class="toggle-thumb"></span></span>
            <span class="toggle-label">Заморозка результатов</span>
            <span v-if="resultsFrozen" class="toggle-hint">Пользователи видят снимок, вы редактируете вживую</span>
          </label>
        </div>
        <div v-if="scoreTasks.length && scoreTeams.length" class="scores-table-wrap">
          <table class="contacts-table scores-table">
            <thead>
              <tr>
                <th class="col-place">#</th>
                <th>Команда</th>
                <th v-for="t in scoreTasks" :key="t.id" :title="t.name">{{ t.number }}</th>
                <th class="col-total">Σ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(team, idx) in rankedTeams" :key="team.id" :class="{ 'row-top': idx < 3 }">
                <td class="col-place">
                  <span :class="['place-badge', `place-${idx + 1}`]">{{ idx + 1 }}</span>
                </td>
                <td class="score-team-name">{{ team.name }}</td>
                <td v-for="t in scoreTasks" :key="t.id" class="score-cell">
                  <input
                    type="number"
                    class="score-input"
                    :value="getScoreInputValue(team.id, t.id)"
                    :max="t.maxPoints"
                    min="0"
                    @input="onScoreInput(team.id, t.id, $event)"
                    @change="onScoreChange(team.id, t.id, $event)"
                  >
                </td>
                <td class="col-total">{{ team.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="content-empty">
          {{ !scoreTasks.length ? 'Сначала добавьте задания' : 'Нет команд' }}
        </div>
      </div>

      <!-- Pipeline -->
      <div v-if="tab === 'pipeline'" class="content-section">
        <div class="content-header">
          <h2>Pipeline (тестирование)</h2>
          <button class="btn-add" @click="createToken">+ Новый токен</button>
        </div>
        <div class="content-divider"></div>

        <div class="pipeline-info">
          <p class="pipeline-hint">Эндпоинт для автоматической отправки баллов:</p>
          <code class="pipeline-url">GET /api/pipeline?team=&lt;hash&gt;&amp;task=&lt;номер&gt;&amp;score=&lt;баллы&gt;&amp;token=&lt;токен&gt;</code>
          <p class="pipeline-hint" style="margin-top: 8px;">Баллы могут только увеличиваться, уменьшить через pipeline нельзя.</p>
        </div>

        <h3 class="pipeline-subtitle">Активные токены</h3>
        <div v-if="pipelineTokens.length" class="pipeline-tokens-list">
          <div v-for="t in pipelineTokens" :key="t.id" :class="['pipeline-token-card', { 'token-revoked': !t.active }]">
            <div class="token-main">
              <code class="token-value">{{ t.token }}</code>
              <span class="token-date">{{ new Date(t.createdAt).toLocaleString('ru') }}</span>
            </div>
            <div class="token-actions">
              <button v-if="t.active" class="btn-copy-token" @click="copyToken(t.token)">Копировать</button>
              <button v-if="t.active" class="btn-revoke" @click="revokeToken(t.id)">Отозвать</button>
              <span v-else class="token-revoked-badge">Отозван</span>
            </div>
          </div>
        </div>
        <div v-else class="content-empty">Нет токенов. Создайте первый.</div>

        <h3 class="pipeline-subtitle" style="margin-top: 24px;">Хэши команд</h3>
        <div v-if="teams.length" class="pipeline-teams-list">
          <div v-for="t in teams" :key="t.id" class="pipeline-team-row">
            <span class="pipeline-team-name">{{ t.name }}</span>
            <code class="pipeline-team-hash">{{ t.hash || '—' }}</code>
          </div>
        </div>
        <div v-else class="content-empty">Нет команд</div>
      </div>
    </div>

    <!-- Task modal -->
    <div v-if="taskModal" class="modal" @click.self="taskModal = false">
      <div class="modal-content">
        <span class="close" @click="taskModal = false">&times;</span>
        <h3>{{ editingTask ? 'Редактировать задание' : 'Новое задание' }}</h3>
        <form @submit.prevent="saveTask">
          <div class="form-group">
            <label>Номер</label>
            <input v-model.number="taskForm.number" type="number" required min="1">
          </div>
          <div class="form-group">
            <label>Название</label>
            <input v-model="taskForm.name" type="text" required>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="taskForm.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Ссылка на документ</label>
            <input v-model="taskForm.link" type="url" placeholder="https://...">
          </div>
          <div class="form-group">
            <label>Макс. баллов</label>
            <input v-model.number="taskForm.maxPoints" type="number" required min="0">
          </div>
          <button type="submit" class="btn-submit">{{ editingTask ? 'Сохранить' : 'Создать' }}</button>
        </form>
      </div>
    </div>

    <!-- Delete task confirm -->
    <div v-if="deleteTaskTarget" class="modal" @click.self="deleteTaskTarget = null">
      <div class="confirm-popup">
        <div class="confirm-icon">!</div>
        <h3>Удалить задание?</h3>
        <p class="confirm-text">«{{ deleteTaskTarget.name }}» будет удалено вместе с баллами. Это действие необратимо.</p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="deleteTaskTarget = null">Отмена</button>
          <button class="btn-confirm-danger" @click="doDeleteTask">Удалить</button>
        </div>
      </div>
    </div>

    <!-- News modal -->
    <div v-if="newsModal" class="modal" @click.self="newsModal = false">
      <div class="modal-content">
        <span class="close" @click="newsModal = false">&times;</span>
        <h3>{{ editingNews ? 'Редактировать новость' : 'Новая новость' }}</h3>
        <form @submit.prevent="saveNews">
          <div class="form-group">
            <label>Заголовок</label>
            <input v-model="newsForm.title" type="text" required>
          </div>
          <div class="form-group">
            <label>Содержание</label>
            <textarea v-model="newsForm.content" required rows="5"></textarea>
          </div>
          <button type="submit" class="btn-submit">{{ editingNews ? 'Сохранить' : 'Опубликовать' }}</button>
        </form>
      </div>
    </div>

    <!-- Delete user confirm -->
    <div v-if="deleteUserTarget" class="modal" @click.self="deleteUserTarget = null">
      <div class="confirm-popup">
        <div class="confirm-icon">!</div>
        <h3>Удалить пользователя?</h3>
        <p class="confirm-text">Пользователь «{{ deleteUserTarget.fullName }}» будет удалён. Это действие необратимо.</p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="deleteUserTarget = null">Отмена</button>
          <button class="btn-confirm-danger" @click="doDeleteUser">Удалить</button>
        </div>
      </div>
    </div>

    <!-- Delete team confirm -->
    <div v-if="deleteTeamTarget" class="modal" @click.self="deleteTeamTarget = null">
      <div class="confirm-popup">
        <div class="confirm-icon">!</div>
        <h3>Удалить команду?</h3>
        <p class="confirm-text">Команда «{{ deleteTeamTarget.name }}» и все её участники будут отвязаны. Это действие необратимо.</p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="deleteTeamTarget = null">Отмена</button>
          <button class="btn-confirm-danger" @click="doDeleteTeam">Удалить</button>
        </div>
      </div>
    </div>

    <!-- Delete confirm -->
    <div v-if="deleteTarget" class="modal" @click.self="deleteTarget = null">
      <div class="confirm-popup">
        <div class="confirm-icon">!</div>
        <h3>Удалить новость?</h3>
        <p class="confirm-text">«{{ deleteTarget.title }}» будет удалена. Это действие необратимо.</p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="deleteTarget = null">Отмена</button>
          <button class="btn-confirm-danger" @click="doDeleteNews">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../composables/auth'
import { api } from '../composables/api'
import { useNotification } from '../composables/notification'

const { show: notify } = useNotification()

const router = useRouter()
const tab = ref('news')

let scoresInterval = null
watch(tab, (val) => {
  if (val === 'scores') {
    scoresInterval = setInterval(loadScores, 5000)
  } else {
    if (scoresInterval) { clearInterval(scoresInterval); scoresInterval = null }
  }
})
onUnmounted(() => { if (scoresInterval) clearInterval(scoresInterval) })
const users = ref([])
const teams = ref([])
const news = ref([])
const contacts = ref([])
const tasks = ref([])

// Scores
const scoreTeams = ref([])
const scoreTasks = ref([])
const scoreMap = ref({})
const scoreDraftMap = ref({})

const newsModal = ref(false)
const editingNews = ref(null)
const newsForm = ref({ title: '', content: '' })
const deleteTarget = ref(null)

const taskModal = ref(false)
const editingTask = ref(null)
const taskForm = ref({ number: 1, name: '', description: '', link: '', maxPoints: 0 })
const deleteTaskTarget = ref(null)
const deleteTeamTarget = ref(null)
const deleteUserTarget = ref(null)

// Settings
const resultsVisible = ref(false)
const tasksVisible = ref(false)
const resultsFrozen = ref(false)

// Pipeline
const pipelineTokens = ref([])

onMounted(async () => {
  if (!auth.user?.isAdmin) {
    router.replace('/dashboard')
    return
  }
  await loadAll()
})

async function loadAll() {
  const [u, t, n, c, tk] = await Promise.all([
    api.adminGetUsers(),
    api.adminGetTeams(),
    api.adminGetNews(),
    api.adminGetContacts(),
    api.adminGetTasks()
  ])
  users.value = u
  teams.value = t
  news.value = n
  contacts.value = c
  tasks.value = tk
  await loadScores()
  await loadSettings()
  await loadPipelineTokens()
}

async function loadScores() {
  try {
    const data = await api.adminGetScores()
    if (hasTeamsChanged(data.teams)) {
      scoreTeams.value = data.teams
    }
    if (hasTasksChanged(data.tasks)) {
      scoreTasks.value = data.tasks
    }
    patchScoreMap(data.scores)
  } catch { /* no tasks yet */ }
}

function hasTeamsChanged(nextTeams) {
  if (scoreTeams.value.length !== nextTeams.length) return true
  for (let i = 0; i < nextTeams.length; i++) {
    const prev = scoreTeams.value[i]
    const next = nextTeams[i]
    if (!prev || prev.id !== next.id || prev.name !== next.name || prev.hash !== next.hash) {
      return true
    }
  }
  return false
}

function hasTasksChanged(nextTasks) {
  if (scoreTasks.value.length !== nextTasks.length) return true
  for (let i = 0; i < nextTasks.length; i++) {
    const prev = scoreTasks.value[i]
    const next = nextTasks[i]
    if (!prev || prev.id !== next.id || prev.number !== next.number || prev.name !== next.name || prev.maxPoints !== next.maxPoints) {
      return true
    }
  }
  return false
}

function patchScoreMap(scores) {
  const current = scoreMap.value
  const seen = new Set()

  for (const s of scores) {
    const key = `${s.teamId}:${s.taskId}`
    seen.add(key)

    if (hasDraftKey(key)) continue

    if (!current[s.teamId]) current[s.teamId] = {}
    if (current[s.teamId][s.taskId] !== s.points) {
      current[s.teamId][s.taskId] = s.points
    }
  }

  for (const teamId of Object.keys(current)) {
    const teamScores = current[teamId]
    for (const taskId of Object.keys(teamScores)) {
      const key = `${teamId}:${taskId}`
      if (hasDraftKey(key)) continue
      if (!seen.has(key)) {
        delete teamScores[taskId]
      }
    }
    if (Object.keys(teamScores).length === 0) {
      delete current[teamId]
    }
  }
}

function hasDraftKey(key) {
  return Object.prototype.hasOwnProperty.call(scoreDraftMap.value, key)
}

function scoreKey(teamId, taskId) {
  return `${teamId}:${taskId}`
}

function getScoreInputValue(teamId, taskId) {
  const key = scoreKey(teamId, taskId)
  if (hasDraftKey(key)) return scoreDraftMap.value[key]
  return getScore(teamId, taskId)
}

function onScoreInput(teamId, taskId, event) {
  const key = scoreKey(teamId, taskId)
  scoreDraftMap.value[key] = event.target.value
}

function getScore(teamId, taskId) {
  return scoreMap.value[teamId]?.[taskId] || 0
}

function getTeamTotal(teamId) {
  const m = scoreMap.value[teamId]
  if (!m) return 0
  return Object.values(m).reduce((s, v) => s + v, 0)
}

const rankedTeams = computed(() => {
  return [...scoreTeams.value]
    .map(t => ({ ...t, total: getTeamTotal(t.id) }))
    .sort((a, b) => b.total - a.total)
})

async function onScoreChange(teamId, taskId, event) {
  const key = scoreKey(teamId, taskId)
  const task = scoreTasks.value.find(t => t.id === taskId)
  const max = task ? task.maxPoints : Infinity
  const raw = hasDraftKey(key) ? scoreDraftMap.value[key] : event.target.value
  let points = parseInt(raw, 10)
  if (Number.isNaN(points)) points = 0
  if (points < 0) points = 0
  if (points > max) points = max
  event.target.value = points
  delete scoreDraftMap.value[key]

  if ((scoreMap.value[teamId]?.[taskId] || 0) === points) return

  try {
    await api.adminUpdateScore(teamId, taskId, points)
    if (!scoreMap.value[teamId]) scoreMap.value[teamId] = {}
    scoreMap.value[teamId][taskId] = points
    notify('Баллы обновлены', 'success')
  } catch (e) {
    notify(e.message || 'Ошибка при сохранении баллов', 'error')
  }
}

async function loadSettings() {
  try {
    const s = await api.adminGetSettings()
    resultsVisible.value = s.results_visible === 'true'
    tasksVisible.value = s.tasks_visible === 'true'
    resultsFrozen.value = s.results_frozen === 'true'
  } catch { /* ignore */ }
}

async function toggleResultsVisible() {
  const val = !resultsVisible.value
  await api.adminUpdateSetting('results_visible', String(val))
  resultsVisible.value = val
  notify(val ? 'Результаты видны всем' : 'Результаты скрыты', 'success')
}

async function toggleTasksVisible() {
  const val = !tasksVisible.value
  await api.adminUpdateSetting('tasks_visible', String(val))
  tasksVisible.value = val
  notify(val ? 'Задания видны всем' : 'Задания скрыты', 'success')
}

async function toggleFreeze() {
  try {
    if (resultsFrozen.value) {
      await api.adminUnfreezeResults()
      resultsFrozen.value = false
      notify('Результаты разморожены — показываются актуальные данные', 'success')
    } else {
      await api.adminFreezeResults()
      resultsFrozen.value = true
      notify('Результаты заморожены — пользователи видят снимок', 'success')
    }
  } catch (e) {
    notify(e.message || 'Ошибка', 'error')
  }
}

// Pipeline functions
async function loadPipelineTokens() {
  try {
    pipelineTokens.value = await api.adminGetPipelineTokens()
  } catch { /* ignore */ }
}

async function createToken() {
  try {
    const t = await api.adminCreatePipelineToken()
    pipelineTokens.value.unshift(t)
    notify('Токен создан', 'success')
  } catch (e) {
    notify(e.message || 'Ошибка создания токена', 'error')
  }
}

async function revokeToken(id) {
  try {
    await api.adminRevokePipelineToken(id)
    const t = pipelineTokens.value.find(x => x.id === id)
    if (t) t.active = false
    notify('Токен отозван', 'success')
  } catch (e) {
    notify(e.message || 'Ошибка', 'error')
  }
}

function copyToken(token) {
  navigator.clipboard.writeText(token)
  notify('Токен скопирован', 'success')
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function tgLink(val) {
  if (!val) return '#'
  val = val.trim()
  if (/^https?:\/\//i.test(val)) return val
  if (val.startsWith('@')) return `https://t.me/${val.slice(1)}`
  if (val.startsWith('t.me/')) return `https://${val}`
  return `https://t.me/${val}`
}

function vkLink(val) {
  if (!val) return '#'
  val = val.trim()
  if (/^https?:\/\//i.test(val)) return val
  if (val.startsWith('@')) return `https://vk.com/${val.slice(1)}`
  if (val.startsWith('vk.com/')) return `https://${val}`
  return `https://vk.com/${val}`
}

function openCreateNews() {
  editingNews.value = null
  newsForm.value = { title: '', content: '' }
  newsModal.value = true
}

function openEditNews(item) {
  editingNews.value = item
  newsForm.value = { title: item.title, content: item.content }
  newsModal.value = true
}

async function saveNews() {
  const { title, content } = newsForm.value
  if (editingNews.value) {
    await api.adminUpdateNews(editingNews.value.id, title, content)
  } else {
    await api.adminCreateNews(title, content)
  }
  newsModal.value = false
  news.value = await api.adminGetNews()
}

function confirmDeleteNews(item) {
  deleteTarget.value = item
}

async function doDeleteNews() {
  await api.adminDeleteNews(deleteTarget.value.id)
  deleteTarget.value = null
  news.value = await api.adminGetNews()
}

function onLogout() {
  auth.logout()
  router.push('/')
}

// Task methods
function openCreateTask() {
  editingTask.value = null
  taskForm.value = { number: tasks.value.length + 1, name: '', description: '', link: '', maxPoints: 0 }
  taskModal.value = true
}

function openEditTask(item) {
  editingTask.value = item
  taskForm.value = { number: item.number, name: item.name, description: item.description, link: item.link || '', maxPoints: item.maxPoints }
  taskModal.value = true
}

async function saveTask() {
  const { number, name, description, link, maxPoints } = taskForm.value
  if (editingTask.value) {
    await api.adminUpdateTask(editingTask.value.id, number, name, description, link, maxPoints)
  } else {
    await api.adminCreateTask(number, name, description, link, maxPoints)
  }
  taskModal.value = false
  tasks.value = await api.adminGetTasks()
  await loadScores()
}

function confirmDeleteTask(item) {
  deleteTaskTarget.value = item
}

async function doDeleteTask() {
  await api.adminDeleteTask(deleteTaskTarget.value.id)
  deleteTaskTarget.value = null
  tasks.value = await api.adminGetTasks()
  await loadScores()
}

function confirmDeleteTeam(item) {
  deleteTeamTarget.value = item
}

async function doDeleteTeam() {
  await api.adminDeleteTeam(deleteTeamTarget.value.id)
  deleteTeamTarget.value = null
  teams.value = await api.adminGetTeams()
  await loadScores()
}

async function toggleAdmin(user) {
  const newStatus = !user.isAdmin
  await api.adminSetAdmin(user.id, newStatus)
  user.isAdmin = newStatus
}

function confirmDeleteUser(item) {
  deleteUserTarget.value = item
}

async function doDeleteUser() {
  await api.adminDeleteUser(deleteUserTarget.value.id)
  deleteUserTarget.value = null
  users.value = await api.adminGetUsers()
  teams.value = await api.adminGetTeams()
}
</script>

<style scoped>
/* Layout */
.admin-layout {
  display: flex;
  height: 100vh;
  background: #fff;
}

/* Sidebar */
.admin-sidebar {
  width: 220px;
  min-width: 220px;
  background: #fff;
  border-right: 1px solid #E5E5E5;
  display: flex;
  flex-direction: column;
  padding: 20px 12px;
}
.sidebar-header {
  padding: 0 8px 20px;
}
.sidebar-title {
  font-size: 17px;
  font-weight: 700;
  color: #000;
  letter-spacing: -0.3px;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
  width: 100%;
  text-align: left;
}
.nav-item:hover {
  background: #F5F5F5;
  color: #333;
}
.nav-item.active {
  background: #F0F0F0;
  color: #000;
  font-weight: 600;
}
.nav-item svg {
  flex-shrink: 0;
  opacity: 0.5;
}
.nav-item.active svg {
  opacity: 0.8;
}
.sidebar-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #E5E5E5;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-back {
  color: #666;
}
.nav-logout {
  color: #999;
}
.nav-logout:hover {
  color: #e53935;
  background: #FFF5F5;
}

/* Content */
.admin-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  min-width: 0;
}
.content-section {
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.content-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.content-header h2 {
  font-size: 17px;
  font-weight: 600;
  color: #000;
  letter-spacing: -0.3px;
}
.header-count {
  font-size: 13px;
  color: #8E8E93;
  font-weight: 500;
  background: #F0F0F0;
  padding: 2px 8px;
  border-radius: 10px;
}
.content-divider {
  height: 1px;
  background: #E5E5E5;
  margin: 12px 0 0;
}

/* Rows */
.content-list {
  display: flex;
  flex-direction: column;
}
.content-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  gap: 16px;
  position: relative;
}
.row-separator {
  height: 1px;
  background: #F0F0F0;
}
.row-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}
.row-title {
  font-size: 15px;
  font-weight: 400;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-caption {
  font-size: 13px;
  color: #8E8E93;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.row-date {
  font-size: 13px;
  color: #8E8E93;
}
.row-actions {
  display: flex;
  gap: 4px;
}
.btn-row-action {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #999;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-row-action:hover {
  background: #F0F0F0;
  color: #333;
}
.btn-row-delete:hover {
  background: #FFF5F5;
  color: #e53935;
}

/* Badges */
.badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
  white-space: nowrap;
}
.badge-admin {
  background: #E8F4FD;
  color: #0088CC;
  font-weight: 600;
}
.badge-role {
  background: #F0F0F0;
  color: #666;
}
.badge-noteam {
  background: #FFF8E1;
  color: #F9A825;
}
.badge-captain {
  background: #1C1C1E;
  color: #fff;
}

/* Add button */
.btn-add {
  margin-left: auto;
  padding: 6px 14px;
  border: 1px solid #E5E5E5;
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  color: #333;
  transition: all 0.15s;
}
.btn-add:hover {
  background: #F5F5F5;
  border-color: #CCC;
}

/* Admin toggle */
.btn-admin-toggle {
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-admin-promote {
  background: #E8F4FD;
  color: #0088CC;
}
.btn-admin-promote:hover {
  background: #D0EAFB;
}
.btn-admin-revoke {
  background: #FFF0F0;
  color: #e53935;
}
.btn-admin-revoke:hover {
  background: #FFE0E0;
}

/* Teams */
.team-block {
  position: relative;
}
.team-row-header {
  padding-bottom: 8px;
}
.team-members-list {
  padding: 0 0 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.member-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  flex-wrap: wrap;
}
.member-name {
  font-weight: 500;
  color: #333;
}
.member-meta {
  color: #8E8E93;
  font-size: 12px;
}

/* Content empty */
.content-empty {
  padding: 32px 0;
  text-align: center;
  font-size: 14px;
  color: #8E8E93;
}

/* Contacts table */
.contacts-table-wrap {
  margin-top: 4px;
  overflow-x: auto;
}
.contacts-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.contacts-table th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #8E8E93;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 12px;
  border-bottom: 1px solid #E5E5E5;
}
.contacts-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #F0F0F0;
  vertical-align: middle;
}
.contacts-table tbody tr:last-child td {
  border-bottom: none;
}
.contact-link {
  color: #0088CC;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}
.contact-link:hover {
  color: #006AA3;
  text-decoration: underline;
}
.contact-link-vk {
  color: #4680C2;
}
.contact-link-vk:hover {
  color: #3A6DA8;
}
.contact-empty {
  color: #CCC;
}
.contact-date {
  color: #8E8E93;
  font-size: 13px;
  white-space: nowrap;
}

/* Textarea */
textarea {
  width: 100%;
  padding: 10px 14px;
  background: #fff;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 14px;
  color: #000;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;
}
textarea:focus {
  outline: none;
  border-color: #999;
}

/* Confirm popup */
.confirm-popup {
  background: #fff;
  border-radius: 14px;
  padding: 28px 24px 24px;
  max-width: 340px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  animation: fadeIn 0.2s ease;
}
.confirm-icon {
  font-size: 18px;
  font-weight: 700;
  color: #e53935;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #FFF0F0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
}
.confirm-popup h3 {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: #000;
  letter-spacing: -0.2px;
}
.confirm-text {
  color: #8E8E93;
  font-size: 13px;
  margin: 0 0 20px;
  line-height: 1.5;
}
.confirm-actions {
  display: flex;
  gap: 8px;
}
.btn-cancel {
  flex: 1;
  padding: 9px 16px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  background: #fff;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-cancel:hover {
  background: #F5F5F5;
  border-color: #CCC;
}
.btn-confirm-danger {
  flex: 1;
  padding: 9px 16px;
  border: none;
  border-radius: 8px;
  background: #e53935;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-confirm-danger:hover {
  background: #c62828;
}

/* Mobile */
@media (max-width: 640px) {
  .admin-layout {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
  .admin-sidebar {
    width: 100%;
    min-width: 0;
    border-right: none;
    border-bottom: 1px solid #E5E5E5;
    padding: 16px;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .sidebar-header {
    padding: 0 4px 0 0;
  }
  .sidebar-nav {
    flex-direction: row;
    gap: 4px;
    flex: initial;
  }
  .nav-item {
    padding: 8px 12px;
    font-size: 13px;
  }
  .nav-item svg {
    display: none;
  }
  .sidebar-footer {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
    flex-direction: row;
    margin-left: auto;
  }
  .admin-content {
    padding: 20px;
  }
}

/* Scores table */
.scores-table-wrap {
  margin-top: 4px;
  overflow-x: auto;
}
.scores-table th {
  text-align: center;
}
.scores-table .col-place {
  width: 40px;
  text-align: center;
}
.scores-table .col-total {
  width: 50px;
  text-align: center;
  font-weight: 700;
  font-size: 15px;
  color: #000;
}
.place-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  background: #F0F0F0;
  color: #333;
}
.place-1 { background: #FFD60A; color: #000; }
.place-2 { background: #D1D1D6; color: #000; }
.place-3 { background: #C8956E; color: #fff; }
.row-top {
  background: #FAFAFA;
}
.score-team-name {
  font-weight: 500;
  color: #000;
  white-space: nowrap;
  text-align: left !important;
}
.score-cell {
  text-align: center;
  padding: 4px 6px !important;
}
.score-input {
  width: 56px;
  padding: 5px 4px;
  text-align: center;
  border: 1px solid #E5E5E5;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  background: #fff;
  color: #000;
  transition: border-color 0.15s;
  -moz-appearance: textfield;
}
.score-input::-webkit-outer-spin-button,
.score-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.score-input:focus {
  outline: none;
  border-color: #999;
}

/* Settings toggles */
.settings-toggles {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
  padding: 16px 18px;
  background: #FAFAFA;
  border: 1px solid #E5E5E5;
  border-radius: 10px;
}
.toggle-row {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}
.toggle-track {
  position: relative;
  width: 44px;
  height: 24px;
  background: #D1D1D6;
  border-radius: 12px;
  transition: background 0.2s;
  flex-shrink: 0;
}
.toggle-track.toggle-on {
  background: #34C759;
}
.toggle-track.toggle-freeze.toggle-on {
  background: #007AFF;
}
.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  transition: transform 0.2s;
}
.toggle-on .toggle-thumb {
  transform: translateX(20px);
}
.toggle-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
.toggle-hint {
  font-size: 12px;
  color: #8E8E93;
  margin-left: auto;
}

/* Pipeline */
.pipeline-info {
  padding: 14px 18px;
  background: #F5F5F7;
  border: 1px solid #E5E5E5;
  border-radius: 10px;
  margin-bottom: 20px;
}
.pipeline-hint {
  font-size: 13px;
  color: #8E8E93;
  margin: 0;
}
.pipeline-url {
  display: block;
  margin-top: 6px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 13px;
  color: #333;
  word-break: break-all;
  user-select: all;
}
.pipeline-subtitle {
  font-size: 15px;
  font-weight: 600;
  color: #000;
  margin-bottom: 10px;
}
.pipeline-tokens-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pipeline-token-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid #E5E5E5;
  border-radius: 10px;
  flex-wrap: wrap;
}
.pipeline-token-card.token-revoked {
  opacity: 0.5;
}
.token-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.token-value {
  font-size: 13px;
  color: #333;
  word-break: break-all;
}
.token-date {
  font-size: 11px;
  color: #8E8E93;
}
.token-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.btn-copy-token {
  padding: 4px 10px;
  border: 1px solid #E5E5E5;
  background: #fff;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  color: #333;
  transition: all 0.15s;
}
.btn-copy-token:hover {
  background: #F5F5F5;
}
.btn-revoke {
  padding: 4px 10px;
  border: 1px solid rgba(255,59,48,0.2);
  background: #fff;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  color: #FF3B30;
  transition: all 0.15s;
}
.btn-revoke:hover {
  background: rgba(255,59,48,0.06);
}
.token-revoked-badge {
  font-size: 12px;
  color: #8E8E93;
  padding: 4px 10px;
  background: #F0F0F0;
  border-radius: 6px;
}
.pipeline-teams-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.pipeline-team-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
}
.pipeline-team-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
.pipeline-team-hash {
  font-size: 14px;
  font-weight: 600;
  color: #007AFF;
  background: #F0F5FF;
  padding: 3px 10px;
  border-radius: 6px;
  letter-spacing: 0.5px;
}
</style>
