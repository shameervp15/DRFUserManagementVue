<template>
  <div class="form-container">
    <h2>Set New Password</h2>
    <form @submit.prevent="confirmReset">
      <p v-if="!isValid">Please check the link in your email and try again.</p>
      
      <div v-else>
          <input type="password" v-model="password" placeholder="New Password" required />
          <input type="password" v-model="passwordConfirm" placeholder="Confirm Password" required />
          <button :disabled="loading">Set Password</button>
      </div>

      <p v-if="message" :class="{'success': !error}">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api/api'

const route = useRoute();
const router = useRouter();

const uid = ref('');
const token = ref('');
const isValid = ref(false);

const password = ref('');
const passwordConfirm = ref('');
const message = ref('');
const loading = ref(false);
const error = ref(false);

onMounted(() => {
    uid.value = route.params.uid;
    token.value = route.params.token;
    
    if (uid.value && token.value) {
        isValid.value = true;
    }
});

async function confirmReset() {
  if (password.value !== passwordConfirm.value) {
    message.value = 'Passwords do not match.';
    error.value = true;
    return;
  }
  
  loading.value = true;
  message.value = '';
  error.value = false;

  try {
    const data = {
        uid: uid.value,
        token: token.value,
        new_password: password.value,
        re_new_password: passwordConfirm.value
    };
    
    await api.post('auth/users/reset_password_confirm/', data);
    message.value = 'Password has been successfully reset. Redirecting to login...';
    
    // Redirect after success
    setTimeout(() => {
        router.push('/users/login'); 
    }, 2000);

  } catch (err) {
    error.value = true;
    message.value = 'Invalid token or link expired. Please request a new reset.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}
</script>

<style>
.form-container {
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