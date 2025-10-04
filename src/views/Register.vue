<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="doRegister">
      <input v-model="username" placeholder="username" required />
      <input v-model="email" placeholder="email" type="email" required />
      <input v-model="password" type="password" placeholder="password" required />
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
      } catch(e){ alert('register failed') }
    }
    return { username, email, password, doRegister }
  }
}
</script>
