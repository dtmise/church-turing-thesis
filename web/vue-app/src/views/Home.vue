<template>
  <div class="auth-page">
    <ContactModal />

    <div class="auth-wrapper">
      <!-- Hero -->
      <div class="hero-section">
        <h1 class="hero-title">Church-Turing<br>Thesis</h1>
        <p class="hero-subtitle">Конкурс по программированию</p>
        <div class="hero-social">
          <a href="https://t.me/+2UInlPHybzhjYzRi" target="_blank" rel="noopener" class="hero-social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 4-1.73 6.67-2.88 8.02-3.45 3.82-1.6 4.62-1.87 5.13-1.88.11 0 .37.03.53.17.14.12.18.28.2.45-.01.06.01.24 0 .37z" fill="currentColor"/></svg>
            Telegram
          </a>
          <a href="https://vk.com/church_turing_thesis" target="_blank" rel="noopener" class="hero-social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.01 13.35h-1.3c-.5 0-.65-.4-1.54-1.3-.78-.75-1.12-.85-1.31-.85-.27 0-.35.08-.35.45v1.19c0 .32-.1.51-1 .51-1.47 0-3.1-.89-4.25-2.56-1.73-2.43-2.2-4.26-2.2-4.63 0-.19.08-.36.45-.36h1.3c.34 0 .46.15.59.51.65 1.9 1.74 3.56 2.19 3.56.17 0 .24-.08.24-.51V9.93c-.05-.88-.52-.95-.52-1.26 0-.15.13-.31.33-.31h2.04c.28 0 .38.15.38.49v2.58c0 .28.13.38.21.38.17 0 .31-.1.62-.41.96-1.07 1.64-2.73 1.64-2.73.09-.19.24-.36.58-.36h1.3c.39 0 .48.2.39.49-.17.77-1.81 3.1-1.81 3.1-.14.23-.2.34 0 .6.14.19.62.6.94.97.59.67 1.05 1.23 1.17 1.62.13.38-.07.58-.45.58z" fill="currentColor"/></svg>
            VK
          </a>
        </div>
      </div>

      <!-- Auth container -->
      <div class="auth-container">
        <div class="tabs">
          <button :class="['tab-btn', { active: tab === 'register' }]" @click="tab = 'register'">Регистрация</button>
          <button :class="['tab-btn', { active: tab === 'login' }]" @click="tab = 'login'">Вход</button>
        </div>

        <!-- Register form -->
        <form v-if="tab === 'register'" class="auth-form active" @submit.prevent="onRegister">
          <div class="form-section">
            <h2>Информация о команде</h2>
            <div class="form-group">
              <label>Название команды</label>
              <input v-model="teamName" type="text" placeholder="Например: Code Warriors" required>
              <div class="input-hint">Уникальное название от 3 до 50 символов</div>
            </div>
          </div>

          <div class="form-section">
            <h2>Участники команды</h2>
            <div v-for="(m, i) in members" :key="i" class="member-card">
              <div class="member-header">
                <span :class="['member-badge', { captain: i === 0 }]">{{ i === 0 ? 'Капитан' : `Участник ${i + 1}` }}</span>
                <button v-if="i > 0" type="button" class="remove-member-btn" @click="members.splice(i, 1)">✕</button>
              </div>
              <div class="member-fields">
                <div class="form-group">
                  <label>ФИО</label>
                  <input v-model="m.fullName" type="text" placeholder="Иванов Иван Иванович" required>
                </div>
                <div class="form-group">
                  <label>Группа</label>
                  <input v-model="m.group" type="text" placeholder="ИУ5-51Б" required>
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input v-model="m.email" type="email" placeholder="example@mail.com" required>
                </div>
                <div class="form-group">
                  <label>Пароль</label>
                  <input v-model="m.password" type="password" placeholder="минимум 6 символов" required minlength="6">
                </div>
              </div>
            </div>

            <button v-if="members.length < 3" type="button" class="btn-add-member" @click="addMember">
              <span>+</span> Добавить участника
            </button>
            <div class="limit-hint">{{ members.length >= 3 ? 'Максимум 3 участника' : `Можно добавить ещё ${3 - members.length}` }}</div>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Регистрация...' : 'Зарегистрировать команду' }}
          </button>
          <p v-if="registerError" class="error-message visible">{{ registerError }}</p>
        </form>

        <!-- Login form -->
        <form v-if="tab === 'login'" class="auth-form active" @submit.prevent="onLogin">
          <div class="form-section">
            <h2>Вход в аккаунт</h2>
            <div class="form-group">
              <label>Email</label>
              <input v-model="loginEmail" type="email" placeholder="example@mail.com" required>
            </div>
            <div class="form-group">
              <label>Пароль</label>
              <input v-model="loginPassword" type="password" placeholder="••••••" required>
            </div>
          </div>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>
          <p v-if="loginError" class="error-message visible">{{ loginError }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../composables/auth'
import ContactModal from '../components/ContactModal.vue'

const router = useRouter()

onMounted(() => {
  if (auth.isAuthenticated) router.replace('/dashboard')
})

const tab = ref('register')
const loading = ref(false)

// Login
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')

async function onLogin() {
  loginError.value = ''
  loading.value = true
  try {
    await auth.login(loginEmail.value, loginPassword.value)
    router.push('/dashboard')
  } catch (e) {
    loginError.value = e.message
  } finally {
    loading.value = false
  }
}

// Register
const teamName = ref('')
const members = ref([{ fullName: '', group: '', email: '', password: '' }])
const registerError = ref('')

function addMember() {
  if (members.value.length < 3) {
    members.value.push({ fullName: '', group: '', email: '', password: '' })
  }
}

async function onRegister() {
  registerError.value = ''
  if (teamName.value.length < 3) { registerError.value = 'Название команды — минимум 3 символа'; return }
  for (let i = 0; i < members.value.length; i++) {
    const m = members.value[i]
    if (!m.fullName || m.fullName.length < 2) { registerError.value = `Участник ${i+1}: укажите ФИО`; return }
    if (!m.group) { registerError.value = `Участник ${i+1}: укажите группу`; return }
    if (!m.email) { registerError.value = `Участник ${i+1}: укажите email`; return }
    if (!m.password || m.password.length < 6) { registerError.value = `Участник ${i+1}: пароль минимум 6 символов`; return }
  }

  loading.value = true
  try {
    await auth.registerTeam({ teamName: teamName.value, members: members.value })
    router.push('/dashboard')
  } catch (e) {
    registerError.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
