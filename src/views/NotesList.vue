<template>
  <div class="container">
    <h2>Notes</h2>
    <ul>
      <li v-for="n in notes" :key="n.id">
        <router-link :to="`/notes/${n.id}`">{{ n.title }}</router-link>
      </li>
    </ul>
    <hr/>
    <h3>Create note</h3>
    <form @submit.prevent="createNote">
      <input v-model="title" placeholder="Title" required />
      <textarea v-model="content" placeholder="Description"></textarea>
      <button>Create</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '../api/api'
export default {
  setup(){
    const notes = ref([]), title = ref(''), content = ref('')
    async function load(){ const res = await api.get('notes/'); notes.value = res.data }
    async function createNote(){
      await api.post('notes/', { title: title.value, description: content.value })
      title.value = content.value = ''
      await load()
    }
    onMounted(load)
    return { notes, title, content, createNote }
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