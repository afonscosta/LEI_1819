<template>
  <div id="app">
    <Slide disableEsc>
      <a id="home" href="#"> 
          <span>Home</span>  
      </a>
      <a id="calendario" href="#/calendario"> 
          <span>Calendário</span>  
      </a>
      <a id="habitos" href="#/habitos"> 
          <span>Hábitos</span>  
      </a>
      <a id="chat" href="#/chat"> 
          <span>Chat</span>  
      </a>
      <a id="jogos" href="#/jogos"> 
          <span>Jogos</span>  
      </a>
      <a id="info" href="#/info"> 
          <span>Páginas Informativas</span>  
      </a>
    </Slide>
    <h1>Cuida24</h1>
    <div id="nav">
     <router-link :to="{ name: 'home' }">Vue</router-link> |
     <router-link :to="{ name: 'calendario' }">Calendário</router-link> |
     <router-link :to="{ name: 'habitos' }">Hábitos</router-link> |
     <router-link :to="{ name: 'chat' }">Chat</router-link> |
     <router-link :to="{ name: 'jogos' }">Jogos</router-link> |
     <router-link :to="{ name: 'info' }">Páginas Informativas</router-link> |
     <router-link :to="{ name: 'messages' }">Django Rest</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { Slide } from 'vue-burger-menu'

export default {
  name: 'App',
  components: {
    Slide
  },
  props: {

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
