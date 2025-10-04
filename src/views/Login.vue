<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="doLogin">
      <input v-model="username" placeholder="username" required />
      <input v-model="password" type="password" placeholder="password" required />
      <button>Login</button>
    </form>
  </div>
</template>
<script>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
export default {
  setup(){
    const username = ref('')
    const password = ref('')
    const auth = useAuthStore()
    async function doLogin(){
      try { await auth.login(username.value, password.value) }
      catch(e){ alert('login failed') }
    }
    return { username, password, doLogin }
  }
}
</script>
