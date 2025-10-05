<template>
  <div class="container">
    <h2>My Notes</h2>
    
    <div class="controls-bar">
      <div class="control-group">
        <input 
          type="text" 
          v-model="searchTerm" 
          @keyup.enter="handleSearch"
          placeholder="Search by title..."
          class="input-field"
        />
        <button @click="handleSearch" class="btn">Search</button>
      </div>

      <div class="control-group">
        <label for="sort-select">Sort:</label>
        <select id="sort-select" v-model="orderBy" @change="handleSort" class="input-field">
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>
    
    <hr/>

    <div v-if="loading" class="loading-state">
      <p>Loading notes...</p>
    </div>
    <div v-else-if="notes.length > 0">
      <ul class="notes-list">
        <li v-for="n in notes" :key="n.id" class="note-item">
          <router-link :to="`/notes/${n.id}`" class="note-link">
            <strong>{{ n.title }}</strong>
            <span class="note-meta"> 
              ({{ n.description ? n.description.substring(0, 50) + '...' : 'No description' }})
            </span>
          </router-link>
        </li>
      </ul>

      <div class="pagination-bar">
        <button 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)" 
          class="btn">
          &lt; Previous
        </button>
        
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }} 
          <small class="total-count">({{ totalNotes }} total)</small>
        </span>
        
        <button 
          :disabled="currentPage === totalPages || totalPages === 0" 
          @click="changePage(currentPage + 1)" 
          class="btn">
          Next &gt;
        </button>
      </div>
    </div>
    <div v-else class="empty-state">
      <p>No notes found matching the criteria. Try a different search term or create a new note!</p>
    </div>

    <hr class="form-separator"/>
    
    <h3>Create Note</h3>
    <form @submit.prevent="createNote" class="create-form">
      <input v-model="title" placeholder="Title" required class="input-field" />
      <textarea v-model="content" placeholder="Description" class="input-field"></textarea>
      <button type="submit" class="btn btn-create">Create</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import api from '../api/api'
export default {
  setup(){
    const notes = ref([]), title = ref(''), content = ref('')

    const loading = ref(true);

    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalNotes = ref(0);
    const totalPages = computed(() => Math.ceil(totalNotes.value / pageSize.value));

    const searchTerm = ref('');
    const orderBy = ref('-created_at');

    const sortOptions = [
        { value: '-created_at', text: 'Newest First' },
        { value: 'title', text: 'Title (A-Z)' },
        { value: '-title', text: 'Title (Z-A)' },
        { value: 'created_at', text: 'Oldest First' },
    ];

    async function fetchNotes() {
        loading.value = true;
        const params = {
            page: currentPage.value,
            page_size: pageSize.value,
            search: searchTerm.value,
            ordering: orderBy.value,
        };

        try {
            const response = await api.get('notes/', { params });
            if (response.data && response.data.results) {
                notes.value = response.data.results;
                totalNotes.value = response.data.count;

                if (notes.value.length === 0 && currentPage.value > 1) {
                    currentPage.value -= 1;
                    fetchNotes();
                }
                
            } else {
                notes.value = response.data.results;
            }
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        } finally {
            loading.value = false;
        }
    }

    
    function handleSearch() {
        currentPage.value = 1;
        fetchNotes();
    }

    function handleSort() {
        currentPage.value = 1;
        fetchNotes();
    }

    
    function changePage(page) {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page;
            fetchNotes();
        }
    }


    async function load(){ const res = await api.get('notes/'); notes.value = res.data.results }
    async function createNote(){
      await api.post('notes/', { title: title.value, description: content.value })
      title.value = content.value = ''
      await load()
    }
    onMounted(load)
    return { notes, title, content, createNote, fetchNotes, searchTerm, orderBy,
            sortOptions, handleSearch, handleSort, changePage, currentPage,
            totalPages, totalNotes
        }
  }
}
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    background-color: #f8f8f8;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2, h3 {
    color: #333;
    border-bottom: 2px solid #ddd;
    padding-bottom: 10px;
}

/* --- Controls Bar (Search/Sort) --- */
.controls-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.control-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.input-field {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

/* --- Buttons --- */
.btn {
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    font-weight: bold;
    transition: background-color 0.2s;
}

.btn:hover:not(:disabled) {
    background-color: #0056b3;
}

.btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.btn-create {
    background-color: #28a745;
}
.btn-create:hover {
    background-color: #1e7e34;
}

/* --- Notes List --- */
.notes-list {
    list-style: none;
    padding: 0;
    margin: 20px 0;
}

.note-item {
    padding: 10px;
    margin-bottom: 8px;
    background: #fff;
    border-radius: 4px;
    border-left: 5px solid #007bff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s;
}

.note-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.note-link {
    text-decoration: none;
    color: #333;
    display: block;
}

.note-meta {
    font-size: 0.9em;
    color: #6c757d;
    margin-left: 10px;
}

/* --- Pagination Bar --- */
.pagination-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
    padding: 10px;
    background: #fff;
    border-radius: 6px;
}

.page-info {
    font-weight: 600;
    color: #333;
}
.total-count {
    font-weight: normal;
    font-size: 0.8em;
}

/* --- Form --- */
.create-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 15px;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.create-form textarea {
    min-height: 100px;
    resize: vertical;
}

.form-separator {
    margin-top: 30px;
    margin-bottom: 20px;
}

.loading-state, .empty-state {
    text-align: center;
    padding: 30px;
    background: #fff0f0;
    border: 1px solid #f0cccc;
    border-radius: 4px;
    color: #a74040;
}
</style>