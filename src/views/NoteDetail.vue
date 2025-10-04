<template>
  <div class="container">
    <h2>{{ note.title }}</h2>
    <p>{{ note.description }}</p>
    <p><strong>Created:</strong> {{ note.created_at }}</p>
    <p><strong>Updated:</strong> {{ note.modified_at }}</p>
    <div v-if="note.attachment">
      <a :href="note.attachment" target="_blank">View Attachment</a>
    </div>
    <hr/>
    <h3>Edit Note</h3>
    <form @submit.prevent="updateNote">
      <input v-model="note.title" placeholder="Title" />
      <textarea v-model="note.description" placeholder="Description"></textarea>
      <input type="file" @change="onFileChange" />
      <button>Save</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import api from "../api/api"

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const note = ref({})
    const file = ref(null)

    async function load() {
      const res = await api.get(`notes/${route.params.id}/`)
      note.value = res.data
    }

    function onFileChange(e) {
      file.value = e.target.files[0]
    }

    async function updateNote() {
      const formData = new FormData()
      formData.append("title", note.value.title)
      formData.append("description", note.value.description)
      if (file.value) formData.append("attachment", file.value)

      await api.put(`notes/${route.params.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      alert("Note updated")
      router.push("/notes")
    }

    onMounted(load)
    return { note, updateNote, onFileChange }
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
