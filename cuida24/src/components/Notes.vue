<template>
  <div>
    <h3 v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">Não foi selecionado nenhum utilizador.</h3>
    <h3 v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">Carregue <router-link :to="{ name: 'menuCalendar' }">aqui</router-link> para escolher um.</h3>
    <b-container v-if="usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0">
      <b-row class="justify-content-md-center">
        <b-col xl="8" lg="8" md="8" sm="12" cols="12">
          <FormNote @returnNote="addNote"></FormNote>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col xl="8" lg="8" md="8" sm="12" cols="12">
          <ListNotes></ListNotes>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import FormNote from '@/components/FormNote'
import ListNotes from '@/components/ListNotes'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Notes',
  components: {
    FormNote,
    ListNotes
  },
  data: () => ({
  }),
  computed: {
    ...mapState({
      usersActive: state => state.users.usersActive
    })
  },
  methods: {
    ...mapActions('notes', ['addNote'])
  }
}
</script>
