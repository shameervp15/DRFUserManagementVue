<template>
  <nav>
    <router-link to="/notes/">Notes</router-link>
    <router-link to="/profile/">Profile</router-link>
    <span v-if="isAuth"> | <a href="#" @click.prevent="logout">Logout</a></span>
    <router-link v-else to="/users/login">Login</router-link>
  </nav>
</template>

<script>
import { useAuthStore } from '../stores/auth'
export default {
  setup() {
    const auth = useAuthStore()
    return { logout: auth.logout, isAuth: auth.isAuthenticated }
  }
}
</script>
