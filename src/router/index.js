import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import NotesList from '../views/NotesList.vue'
import NoteDetail from '../views/NoteDetail.vue'
import Profile from '../views/Profile.vue'
import PasswordReset from '../views/PasswordReset.vue'
import PasswordResetConfirm from '../views/PasswordResetConfirm.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/notes', component: NotesList },
  { path: '/notes/:id(\\d+)', component: NoteDetail, props: true },
  { path: '/profile', component: Profile },
  { path: '/users/reset-password/', component: PasswordReset },
  { path: '/users/reset-password-confirm/:uid/:token', component: PasswordResetConfirm },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundRedirect',
    beforeEnter: (to, from, next) => {
      const loggedIn = !!localStorage.getItem('access_token')
      if (loggedIn) next('/notes')
      else next('/login')
    }
  }
]

const router = createRouter({ history: createWebHistory(), routes })

// guard: simple token check (keeps router independent of store)
router.beforeEach((to, from, next) => {
  const publicPages = [
    '/login', '/register', '/users/reset-password/', 
    '/users/reset-password-confirm/:uid/:token'
  ]
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = !!localStorage.getItem('access_token')
  if (authRequired && !loggedIn) return next('/login')
  if (to.path === '/login' && loggedIn) return next('/notes')
  next()
})

export default router
