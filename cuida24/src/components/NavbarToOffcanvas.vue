<template>
  <nav class="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
    <button class="navbar-toggler p-0 border-0" type="button" @click="toggleoffcanvas">
      <span class="navbar-toggler-icon"></span>
    </button>
    <router-link class="navbar-brand" :to="{ name: 'home' }" @click.native="offoffcanvas() + currentUpdate('')">Cuida24</router-link>
  
    <div class="navbar-collapse offcanvas-collapse" v-bind:class="{ open: collapse }" id="navbarsExampleDefault">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item" v-bind:class="{ active: calendarioCurrent }">
          <router-link class="nav-link" :to="{ name: 'calendario' }" @click.native="toggleoffcanvas() + currentUpdate('calendario')">
            Calendário
            <span class="sr-only">(current)</span>
          </router-link>
          </li>
        <li class="nav-item" v-bind:class="{ active: habitosCurrent }">
          <router-link class="nav-link" :to="{ name: 'habitos' }" @click.native="toggleoffcanvas() + currentUpdate('habitos')">
            Hábitos
            <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item" v-bind:class="{ active: chatCurrent }">
          <router-link class="nav-link" :to="{ name: 'chat' }" @click.native="toggleoffcanvas() + currentUpdate('chat')">
            Chat
            <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item" v-bind:class="{ active: jogosCurrent }">
          <router-link class="nav-link" :to="{ name: 'jogos' }" @click.native="toggleoffcanvas() + currentUpdate('jogos')">
            Jogos
            <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <b-nav-item-dropdown id="info-dropdown" text="Páginas Informativas" v-bind:class="{ active: infoCurrent }">
          <b-dropdown-item :to="{ name: 'info-iadem' }" @click.native="currentUpdate('info') + toggleoffcanvas()">
            Projeto IADem
          </b-dropdown-item>
          <b-dropdown-item :to="{ name: 'info-demencia' }" @click.native="currentUpdate('info') + toggleoffcanvas()">
            Literacia na demência
          </b-dropdown-item>
          <b-dropdown-item :to="{ name: 'info-apoio' }" @click.native="currentUpdate('info') + toggleoffcanvas()">
            Redes e grupos de apoio
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
	name: 'NavbarToOffcanvas',
	data() {
		return {
			collapse: false,
			calendarioCurrent: false,
			habitosCurrent: false,
			chatCurrent: false,
			jogosCurrent: false,
			infoCurrent: false
		}
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
		currentUpdate: function(page) {
			this.calendarioCurrent = false
			this.habitosCurrent = false
			this.chatCurrent = false
			this.jogosCurrent = false
			this.infoCurrent = false
			if (page == "calendario") {
				this.calendarioCurrent = true
			}
			else if (page == "habitos") {
				this.habitosCurrent = true
			}
			else if (page == "chat") {
				this.chatCurrent = true
			}
			else if (page == "jogos") {
				this.jogosCurrent = true
			}
			else if (page == "info") {
				this.infoCurrent = true
			}
		}
	}
}
</script>

<style>
</style>
