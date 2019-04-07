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
import NavbarToOffcanvas from './components/NavbarToOffcanvas.vue'

export default {
  name: 'App',
  data: () => ({
  }),
  components: {
    NavbarToOffcanvas
  },
  methods: {
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
  margin-top: 60px;
}
</style>
