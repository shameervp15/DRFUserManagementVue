<template>
  <div class="container">
    <h2>Register</h2>
    <form @submit.prevent="doRegister">
      <input v-model="username" placeholder="Username" required />
      <input v-model="email" placeholder="Email address" type="email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button>Register</button>
    </form>
  </div>
</template>
<script>
import { ref } from 'vue'
import api from '../api/api'
import { useRouter } from 'vue-router'
export default {
  setup(){
    const username = ref(''), email = ref(''), password = ref('')
    const router = useRouter()
    async function doRegister(){
      try {
        await api.post('users/register/', { username: username.value, email: email.value, password: password.value })
        alert('Registered — please login')
        router.push('/login')
      } catch(error){ 
        if (error.response && error.response.data) {
          const data = error.response.data
          let message = ''

          if (typeof data === 'string') {
            message = data
          } else if (Array.isArray(data)) {
            message = data.join(', ')
          } else if (typeof data === 'object') {
            message = Object.values(data).flat().join(', ')
          } else {
            message = 'Registration failed.'
          }
          alert(message)
        } else {
          alert('Network or server error.')
        }
      }
    }
    return { username, email, password, doRegister }
  }
}
</script>

<style>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
textarea, input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}
</style>