<template>

  <div id="app">
    <NavbarToOffcanvas v-if="['calendario'].indexOf($route.name) < 0" ></NavbarToOffcanvas>

    <!--<h1>Cuida24</h1>-->

    <!--<div id="nav">-->
     <!--<router-link :to="{ name: 'home' }">Vue</router-link> |-->
     <!--<router-link :to="{ name: 'messages' }">Django Rest</router-link>-->
    <!--</div>-->
    <router-view/>
  </div>
</template>

<script>
// import * as firebase from 'firebase'
import NavbarToOffcanvas from './components/NavbarToOffcanvas.vue'

export default {
  name: 'App',
  data: () => ({
  }),
  components: {
    NavbarToOffcanvas
  },
  methods: {
  },
  created () {
    var token = localStorage.getItem('token')
    if (token) {
      // Verificar a validade
      this.$store.dispatch('login/setPlainToken', token)
      this.$router.push('/')
    } else {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
</style>
