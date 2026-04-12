const API_URL = `${window.location.origin}/api`

async function request(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers, credentials: 'include' })
  const data = await res.json()
  if (res.status === 401 && !endpoint.startsWith('/auth/')) {
    localStorage.removeItem('user')
    window.location.href = '/'
    throw new Error('Сессия истекла')
  }
  if (!res.ok) throw new Error(data.error || 'Ошибка запроса')
  return data
}

export const api = {
  login: (creds) => request('/auth/login', { method: 'POST', body: JSON.stringify(creds) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getProfile: () => request('/auth/me'),
  getTeams: () => request('/teams'),
  getNews: () => request('/news'),
  createTeam: (name) => request('/teams', { method: 'POST', body: JSON.stringify({ name }) }),
  joinTeam: (inviteCode) => request('/teams/join', { method: 'POST', body: JSON.stringify({ inviteCode }) }),
  deleteTeam: () => request('/teams', { method: 'DELETE' }),
  leaveTeam: () => request('/teams/leave', { method: 'POST' }),
  updateProfile: (data) => request('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updateEmail: (email) => request('/profile/email', { method: 'PUT', body: JSON.stringify({ email }) }),
  updatePassword: (oldPassword, newPassword) => request('/profile/password', { method: 'PUT', body: JSON.stringify({ oldPassword, newPassword }) }),
  updateTeamName: (name) => request('/profile/team-name', { method: 'PUT', body: JSON.stringify({ name }) }),
  submitContact: (data) => request('/contacts', { method: 'POST', body: JSON.stringify(data) }),

  // Admin
  adminGetUsers: () => request('/admin/users'),
  adminGetTeams: () => request('/admin/teams'),
  adminGetNews: () => request('/admin/news'),
  adminCreateNews: (title, content) => request('/admin/news', { method: 'POST', body: JSON.stringify({ title, content }) }),
  adminUpdateNews: (id, title, content) => request(`/admin/news/${id}`, { method: 'PUT', body: JSON.stringify({ title, content }) }),
  adminDeleteNews: (id) => request(`/admin/news/${id}`, { method: 'DELETE' }),
  adminSetAdmin: (userId, isAdmin) => request(`/admin/users/${userId}/admin`, { method: 'PATCH', body: JSON.stringify({ isAdmin }) }),
  adminGetContacts: () => request('/admin/contacts'),

  // Admin tasks
  adminGetTasks: () => request('/admin/tasks'),
  adminCreateTask: (number, name, description, link, maxPoints) => request('/admin/tasks', { method: 'POST', body: JSON.stringify({ number, name, description, link, maxPoints }) }),
  adminUpdateTask: (id, number, name, description, link, maxPoints) => request(`/admin/tasks/${id}`, { method: 'PUT', body: JSON.stringify({ number, name, description, link, maxPoints }) }),
  adminDeleteTask: (id) => request(`/admin/tasks/${id}`, { method: 'DELETE' }),

  // Admin scores
  adminGetScores: () => request('/admin/scores'),
  adminUpdateScore: (teamId, taskId, points) => request('/admin/scores', { method: 'PUT', body: JSON.stringify({ teamId, taskId, points }) }),

  // Admin settings
  adminGetSettings: () => request('/admin/settings'),
  adminUpdateSetting: (key, value) => request('/admin/settings', { method: 'PUT', body: JSON.stringify({ key, value }) }),
  adminFreezeResults: () => request('/admin/settings/freeze', { method: 'POST' }),
  adminUnfreezeResults: () => request('/admin/settings/unfreeze', { method: 'POST' }),

  // Pipeline tokens
  adminGetPipelineTokens: () => request('/admin/pipeline-tokens'),
  adminCreatePipelineToken: () => request('/admin/pipeline-tokens', { method: 'POST' }),
  adminRevokePipelineToken: (id) => request(`/admin/pipeline-tokens/${id}`, { method: 'DELETE' })
}
