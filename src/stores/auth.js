import { defineStore } from 'pinia'
import api from '../api/api'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token')
  }),
  getters: {
    isAuthenticated: state => !!state.access
  },
  actions: {
    async login(username, password) {
      const res = await api.post('users/login/', { username, password })
      this.access = res.data.access
      this.refresh = res.data.refresh
      localStorage.setItem('access_token', this.access)
      localStorage.setItem('refresh_token', this.refresh)
      await this.fetchProfile()
      router.push('/notes/')
    },
    async logout() {
      const refresh = this.refresh
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      this.access = this.refresh = null
      this.user = null
      if (refresh) api.post('users/logout/', { refresh }).catch(()=>{})
      router.push('/login')
    },
    async fetchProfile() {
      try {
        const res = await api.get('users/profile/')
        this.user = res.data
      } catch {
        this.user = null
      }
    }
  }
})
