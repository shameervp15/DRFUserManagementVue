import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/'

const api = axios.create({ baseURL })

// attach access token
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('access_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// simple refresh-on-401 flow
api.interceptors.response.use(
  r => r,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const res = await axios.post(baseURL + 'users/refresh/', { refresh })
          localStorage.setItem('access_token', res.data.access)
          api.defaults.headers.common.Authorization = `Bearer ${res.data.access}`
          original.headers.Authorization = `Bearer ${res.data.access}`
          return api(original)
        } catch (e) {
          // refresh failed → force logout
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location = '/login'
        }
      }
    }
    return Promise.reject(err)
  }
)

export default api
