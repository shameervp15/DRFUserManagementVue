<template>
  <nav>
    <span v-if="isAuth">
      <router-link to="/notes/">Notes</router-link>
      |
      <router-link to="/profile/">Profile</router-link>
      |
      <a href="#" @click.prevent="handleLogout">Logout</a>
    </span>

    <span v-else>
      |
      <router-link to="/register">Register</router-link>
      |
      <router-link to="/login">Login</router-link>
      |
      <router-link to="/users/reset-password/">Reset Password</router-link>
    </span>
  </nav>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router'; 
import { storeToRefs } from 'pinia'; // <-- Import storeToRefs

export default {
  setup() {
    const auth = useAuthStore();
    const router = useRouter(); 

    // This creates a reactive 'ref' called 'isAuthenticated' linked to the store's state.
    const { isAuthenticated } = storeToRefs(auth); 

    const handleLogout = async () => {
      await auth.logout(); 
      router.push('/users/login');
    };

    return { 
      handleLogout, 
      // 🚀 Pass the reactive ref back to the template
      isAuth: isAuthenticated
    };
  }
}
</script>

<style scoped>
nav {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 20px;
  background-color: #333; /* Dark background */
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 0 8px;
  transition: color 0.3s;
}

nav a:hover {
  color: #ffcc00; /* Highlight on hover */
}

/* Style for the active link */
nav a.router-link-exact-active {
  color: #007bff; /* Blue color for active route */
}

nav span {
  padding: 0 5px;
}

/* Style for the Logout link (using <a> tag) */
nav a[href="#"] {
  cursor: pointer;
}
</style>