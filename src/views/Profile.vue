<template>
  <div class="container">
    <h2>My Profile</h2>
    <form @submit.prevent="updateProfile">
      <label>Full Name</label>
      <input v-model="profile.fullname" />

      <label>Address</label>
      <textarea v-model="profile.address"></textarea>

      <label>Date of Birth</label>
      <input 
        v-model="profile.date_of_birth" 
        type="date" 
        :readonly="!!profile.date_of_birth" 
        :placeholder="!profile.date_of_birth ? 'YYYY-MM-DD' : ''"
      />

      <label>Gender</label>
      <input 
        v-model="profile.geneder"
      />

      <label>Mobile Number</label>
      <input v-model="profile.mobilenumber" />

      <button>Save</button>
    </form>


    <hr class="separator">

    <div class="delete-section">
      <h3>Delete Account</h3>
      <input 
        v-model="deleteConfirmation"
        type="text"
        placeholder="Type DELETE ME to confirm"
        class="delete-input"
      />

      <button 
        @click="deleteAccount" class="delete-button"
      >
        Delete My Account
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue"
import api from "../api/api"
import { useRouter } from "vue-router"

export default {
  setup() {
    const profile = ref({})
    const deleteConfirmation = ref('')
    const router = useRouter()

    async function load() {
      const res = await api.get("users/profile/")
      profile.value = res.data
    }

    async function updateProfile() {
      await api.put("users/profile/", profile.value)
      alert("Profile updated successfully!")
    }

    async function deleteAccount() {
      if (deleteConfirmation.value !== 'DELETE ME') {
        alert("Please type 'DELETE ME' to confirm account deletion.")
        return
      }

      if (confirm("Are you absolutely sure you want to delete your account? This cannot be undone.")) {
        try {
          await api.delete("users/profile/")
          alert("Your account has been successfully deleted. You will now be logged out.")
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          router.push('/users/login');
          window.location.reload();

        } catch (error) {
          alert("An error occurred during deletion. Please try again.")
          console.error("Error deleting account:", error)
        }
      }
    }

    onMounted(load)
    return { profile, updateProfile, deleteAccount, deleteConfirmation }
  }
}
</script>

<style>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
label {
  font-weight: bold;
  display: block;
  margin-top: 10px;
}
input, textarea, select {
  width: 100%;
  margin-bottom: 10px;
  padding: 6px;
}
button {
  padding: 8px 14px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}

.separator {
  margin: 30px 0;
  border: 0;
  height: 1px;
  background-color: #ddd;
}


.delete-section h3 {
    margin-top: 0;
    color: #ff4d4f; /* Red color for the heading */
}

.delete-input {
  border: 1px solid #ff4d4f;
  background-color: white;
  margin-bottom: 15px;
}

.delete-button {
  padding: 8px 14px;
  background: #ff4d4f; /* Red background for delete button */
  color: white;
  border: none;
  cursor: pointer;
}
.delete-button:hover:not(:disabled) {
  background: #cc0000;
}
.delete-button:disabled {
  background: #ff7875; /* Lighter red when disabled */
  cursor: not-allowed;
}

/* ... existing styles for button ... */
button {
  padding: 8px 14px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}
</style>
