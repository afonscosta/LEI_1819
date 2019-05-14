<template>
  <div>
    <b-modal 
      ref="modal-group"
      hide-footer title="Eliminação de sessão de grupo"
    >
      <div class="d-block text-center">
        <h3>Tem a certeza que pretende eliminar a sessão de grupo?</h3>
      </div>
      <b-button class="mt-3" variant="danger" block @click="confirme('group', true)">Sim</b-button>
      <b-button class="mt-2" variant="success" block @click="confirme('group', false)">Não</b-button>
    </b-modal>

    <b-modal 
      ref="modal-indiv"
      hide-footer title="Eliminação de sessão individual"
    >
      <div class="d-block text-center">
        <h3>Tem a certeza que pretende eliminar a sessão individual?</h3>
      </div>
      <b-button class="mt-3" variant="danger" block @click="confirme('indiv', true)">Sim</b-button>
      <b-button class="mt-2" variant="success" block @click="confirme('indiv', false)">Não</b-button>
    </b-modal>

    <h3 v-if="groupSessions.length === 0">Não existem sessões de grupo para os utilizadores selecionados.</h3>

    <h3 v-if="indivSessions.length === 0">Não existem sessões individuais para o(s) utilizador(es) selecionado(s).</h3>

    <b-card
      v-for="gs in groupSessions"
      :key="gs.pk"
      border-variant="dark"
      header="Sessão de Grupo"
    >
      <b-card-text align="left">{{ gs.groupSession.theme }}</b-card-text>
      <b-card-text align="left">{{ gs.groupSession.description }}</b-card-text>
      <b-button variant="danger" @click="removeGroupSession(gs.pk)">Eliminar</b-button>
      <b-button @click="editGroupSession(gs)">Editar</b-button>
    </b-card>

    <b-card
      v-for="is in indivSessions"
      :key="is.pk"
      border-variant="dark"
      header="Sessão Individual"
    >
      <b-card-text align="left">{{ is.individualSession.theme }}</b-card-text>
      <b-card-text align="left">{{ is.individualSession.description }}</b-card-text>
      <b-button variant="danger" @click="removeIndivSession(is.pk)">Eliminar</b-button>
      <b-button @click="editIndivSession(is)">Editar</b-button>
    </b-card>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import FormSession from './FormSession'

export default {
  name: 'listSessions',
  components: {
    FormSession
  },
  props: {
  },
  data: () => ({
    groupSessionToRemove: null,
    indivSessionToRemove: null
  }),
  created () {
    if (this.usersActive.caregivers.length !== 0 || this.usersActive.patients.length !== 0) {
      this.$store.dispatch('events/getEvents', this.usersActive)
    }
  },
  computed: {
    ...mapState({
      groupSessions: state => state.sessions.groupSessions,
      indivSessions: state => state.sessions.indivSessions,
      usersActive: state => state.users.usersActive
    })
  },
  methods: {
    ...mapActions('sessions', [
      'updateIndivSession',
      'deleteIndivSession',
      'updateGroupSession',
      'deleteGroupSession'
    ]),
    log (info) {
      console.log(info)
    },
    editGroupSession (gs) {
      this.$emit('editGroupSession', gs)
    },
    removeGroupSession (groupSessionPK) {
      this.groupSessionToRemove = groupSessionPK
      this.showModal('modal-group')
    },
    editIndivSession (is) {
      this.$emit('editIndivSession', is)
    },
    removeIndivSession (indivSessionPK) {
      this.indivSessionToRemove = indivSessionPK
      this.showModal('modal-indiv')
    },
    showModal (type) {
      this.$refs[type].show()
    },
    confirme (type, bool) {
      if (type === 'group') {
        if (bool === true) {
          console.log('deleting groupSession with PK =', this.groupSessionToRemove)
          this.deleteSession(this.groupSessionToRemove)
        }
        this.groupSessionToRemove = null
        this.$refs['modal-group'].hide()
      } else if (type === 'indiv') {
        if (bool === true) {
          console.log('deleting indivSession with PK =', this.indivSessionToRemove)
          this.deleteSession(this.indivSessionToRemove)
        }
        this.indivSessionToRemove = null
        this.$refs['modal-indiv'].hide()
      }
    },
    beforeUpdateGroupSession (gs) {
      this.editingGroupSession = null
      this.updateGroupSession(gs)
    },
    beforeUpdateIndivSession (is) {
      this.editingIndivSession = null
      this.updateIndivSession(is)
    }
  }
}
</script>
