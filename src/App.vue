<template>
  <div id="app">
    <TheNavbar /> 

    <main>
      <router-view />
    </main>

    </div>
</template>

<script>
import TheNavbar from './components/Navbar.vue'; // Adjust the path as needed

export default {
  name: 'App',
  components: {
    TheNavbar
  }
}
</script>

<style>
/* Global styles for the app */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
main {
    padding-top: 60px; /* Example: Add padding to main content if navbar is fixed/sticky */
}
</style>