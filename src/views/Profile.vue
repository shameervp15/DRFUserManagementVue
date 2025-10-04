<template>
  <div class="container">
    <h2>My Profile</h2>
    <form @submit.prevent="updateProfile">
      <label>Full Name</label>
      <input v-model="profile.fullname" />

      <label>Address</label>
      <textarea v-model="profile.address"></textarea>

      <label>Date of Birth</label>
      <input type="date" v-model="profile.dateofbirth" />

      <label>Gender</label>
      <select v-model="profile.gender">
        <option value="M">Male</option>
        <option value="F">Female</option>
        <option value="O">Other</option>
      </select>

      <label>Mobile Number</label>
      <input v-model="profile.mobilenumber" maxlength="10" />

      <button>Save</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue"
import api from "../api/api"

export default {
  setup() {
    const profile = ref({})

    async function load() {
      const res = await api.get("users/profile/")
      profile.value = res.data
    }

    async function updateProfile() {
      await api.put("users/profile/", profile.value)
      alert("Profile updated successfully!")
    }

    onMounted(load)
    return { profile, updateProfile }
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
</style>
