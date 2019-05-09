<template>
  <div>
    <h3 v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">Não foi selecionado nenhum utilizador.</h3>
    <h3 v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">Carregue <router-link :to="{ name: 'calendar' }">aqui</router-link> para escolher um.</h3>
    <b-container v-if="usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0">
      <b-row class="justify-content-md-center">
        <b-col xl="12" lg="12" md="12" sm="12" cols="12">
          <FormGroupSession 
            @returnGroupSession="addGroupSession"
          ></FormGroupSession>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col xl="8" lg="8" md="8" sm="12" cols="12">
          <ListGroupSessions></ListGroupSessions>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import FormGroupSession from './FormGroupSession'
import ListGroupSessions from './ListGroupSessions'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'GroupSession',
  components: {
    FormGroupSession,
    ListGroupSessions
  },
  computed: {
    ...mapState({
      usersActive: state => state.users.usersActive
    })
  },
  methods: {
    ...mapActions('groupSessions', ['addGroupSession'])
  }
}
</script>
