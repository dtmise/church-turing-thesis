import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      if (!token) next({ name: 'Home' })
      else next()
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
