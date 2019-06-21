<template>
  <nav class="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
    <button class="navbar-toggler p-0 border-0" type="button" @click="toggleoffcanvas">
      <span class="navbar-toggler-icon"></span>
    </button>
    <router-link class="navbar-brand" :to="{ name: 'home' }" @click.native="offoffcanvas() + currentUpdate('')">Cuida24</router-link>
    <img src="@/assets/logo-IADem.png" width="30" height="30" alt="">
  
    <div class="navbar-collapse offcanvas-collapse" v-bind:class="{ open: collapse }" id="navbarsExampleDefault">
      <ul class="navbar-nav mr-auto">
        <!--<li class="nav-item" v-bind:class="{ active: calendarioCurrent }">-->
          <!--<router-link class="nav-link" :to="{ name: 'calendario' }" @click.native="toggleoffcanvas() + currentUpdate('calendario')">-->
            <!--Calendário-->
            <!--<span class="sr-only">(current)</span>-->
          <!--</router-link>-->
        <!--</li>-->
        <li class="nav-item" v-bind:class="{ active: calendarCurrent }">
          <router-link
            class="nav-link"
            :to="{ name: 'calendar' }"
            @click.native="toggleoffcanvas() + currentUpdate('calendar')"
          >
            Calendário
            <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item" v-bind:class="{ active: medicationCurrent }">
          <router-link
            class="nav-link"
            :to="{ name: 'medication' }"
            @click.native="toggleoffcanvas() + currentUpdate('medication')">
            Medicação
            <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item" v-bind:class="{ active: habitsCurrent }">
          <router-link class="nav-link"
            :to="{ name: 'habits' }"
            @click.native="toggleoffcanvas() + currentUpdate('habits')">
            Hábitos
            <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item" v-bind:class="{ active: chatCurrent }">
          <router-link class="nav-link"
            :to="{ name: 'chat' }"
            @click.native="toggleoffcanvas() + currentUpdate('chat')">
            Chat
            <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item" v-bind:class="{ active: jogosCurrent }">
          <router-link class="nav-link"
            :to="{ name: 'jogos' }"
            @click.native="toggleoffcanvas() + currentUpdate('jogos')">
            Jogos
            <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item" v-bind:class="{ active: infoCurrent }">
          <router-link class="nav-link"
            :to="{ name: 'info' }"
            @click.native="toggleoffcanvas() + currentUpdate('info')">
            Páginas Informativas
            <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item" v-bind:class="{ active: addUsersCurrent }">
          <router-link class="nav-link"
            :to="{ name: 'addUsers' }"
            @click.native="toggleoffcanvas() + currentUpdate('addUsers')">
            Adicionar utilizadores
            <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item" v-bind:class="{ active: medicineCurrent }">
          <router-link class="nav-link"
            :to="{ name: 'medicine' }"
            @click.native="toggleoffcanvas() + currentUpdate('medicine')">
            Medicamentos
            <span class="sr-only">(current)</span>
          </router-link>
        </li>
      </ul>
      <router-link v-if="!token && $route.name != 'login'" class="btn btn-primary" :to="{ name: 'login' }">
        Login
      </router-link>
      <b-button v-if="token" @click="logout">Logout</b-button>
    </div>
  </nav>


</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NavbarToOffcanvas',
  data () {
    return {
      collapse: false,
      calendarioCurrent: false,
      calendarCurrent: false,
      medicationCurrent: false,
      habitsCurrent: false,
      chatCurrent: false,
      jogosCurrent: false,
      infoCurrent: false,
      addUsersCurrent: false,
      medicineCurrent: false
    }
  },
  computed: {
    ...mapState({
      token: state => state.login.accesstoken
    })
  },
  methods: {
    toggleoffcanvas: function () {
      this.collapse = !this.collapse
      return this.collapse
    },
    offoffcanvas: function () {
      this.collapse = false
      return this.collapse
    },
    currentUpdate: function (page) {
      this.calendarioCurrent = false
      this.calendarCurrent = false
      this.medicationCurrent = false
      this.habitsCurrent = false
      this.chatCurrent = false
      this.jogosCurrent = false
      this.infoCurrent = false
      this.addUsersCurrent = false
      this.medicineCurrent = false
      if (page === 'calendar') {
        this.calendarCurrent = true
      } else if (page === 'medication') {
        this.medicationCurrent = true
      } else if (page === 'habits') {
        this.habitsCurrent = true
      } else if (page === 'chat') {
        this.chatCurrent = true
      } else if (page === 'jogos') {
        this.jogosCurrent = true
      } else if (page === 'info') {
        this.infoCurrent = true
      } else if (page === 'addUsers') {
        this.addUsersCurrent = true
      } else if (page === 'medicine') {
        this.medicineCurrent = true
      }
    },
    logout () {
      // Terminar sessão no django
      this.$store.dispatch('login/deleteToken')
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style>
</style>
