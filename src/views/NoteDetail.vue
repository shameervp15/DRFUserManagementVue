<template>
  <div class="container">
    <div v-if="message" class="alert">{{ message }}</div>
    <div v-else-if="note">
      <h2>{{ note.title }}</h2>
      <p>{{ note.description }}</p>
      <p><strong>Created:</strong> {{ formatDate(note.created_at) }}</p>
      <p><strong>Updated:</strong> {{ formatDate(note.modified_at) }}</p>
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
      <form @submit.prevent="deleteNote">
        <button>Delete Note</button>
      </form>
    </div>
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
    const message = ref('')

    async function load() {
      try {
        const res = await api.get(`notes/${route.params.id}/`)
        note.value = res.data
      } catch (err) {
        if (err.response && err.response.status === 404) {
          message.value = `Note with id "${route.params.id}" not found`
        } else {
          message.value = 'An error occurred while loading the note.'
        }
        setTimeout(() => {
          router.push('/notes')
        }, 3000)
      }
    }

    function onFileChange(e) {
      file.value = e.target.files[0]
    }

    function formatDate(val) {
        if (!val) return ''
        return new Date(val).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        })
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

    async function deleteNote() {
        await api.delete(`notes/${route.params.id}/`)
      alert("Note deleted successfully!")
      router.push("/notes")
    }

    onMounted(load)
    return { note, updateNote, onFileChange, formatDate, deleteNote, message }
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
.alert {
  background-color: #ffe5e5;
  color: #a00;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}
</style>
