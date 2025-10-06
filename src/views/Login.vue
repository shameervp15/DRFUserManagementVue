<template>
  <div class="container">
    <h2>Login</h2>
    <form @submit.prevent="doLogin">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button>Login</button>
    </form>

    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Logging in, please wait... (may take up to 50s)</p>
    </div>

  </div>
</template>
<script>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
export default {
  setup(){
    const username = ref('')
    const password = ref('')
    const isLoading = ref(false)

    const auth = useAuthStore()

    async function doLogin(){
      isLoading.value = true
      try { await auth.login(username.value, password.value) }
      catch(e){ alert('login failed') }
      finally { isLoading.value = false }
    }
    return { username, password, doLogin, isLoading }
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
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.loading {
  text-align: center;
  margin-top: 15px;
}
.spinner {
  margin: 10px auto;
  border: 4px solid #ccc;
  border-top: 4px solid #333;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
