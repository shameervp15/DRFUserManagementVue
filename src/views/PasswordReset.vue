<template>
  <div class="form-container">
    <h2>Reset Password</h2>
    <form @submit.prevent="requestReset">
      <p>Enter your email to receive a password reset link.</p>
      <input type="email" v-model="email" placeholder="Your Email" required />
      <button :disabled="loading">{{ loading ? 'Sending...' : 'Send Reset Link' }}</button>
      <p v-if="message" :class="{'success': !error}">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api/api'

const email = ref('');
const message = ref('');
const loading = ref(false);
const error = ref(false);

async function requestReset() {
  loading.value = true;
  message.value = '';
  error.value = false;

  try {
    await api.post('auth/users/reset_password/', { email: email.value });
    message.value = 'If your account exists, a reset link has been sent to your email.';
  } catch (err) {
    error.value = true;
    message.value = 'An error occurred. Please try again.'; 
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