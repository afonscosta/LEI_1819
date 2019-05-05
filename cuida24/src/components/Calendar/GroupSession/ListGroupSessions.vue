<template>
  <div>
    <b-modal 
      ref="my-modal"
      hide-footer title="Eliminação de sessão de grupo"
    >
      <div class="d-block text-center">
        <h3>Tem a certeza que pretende eliminar a sessão de grupo?</h3>
      </div>
      <b-button class="mt-3" variant="danger" block @click="confirme(true)">Sim</b-button>
      <b-button class="mt-2" variant="success" block @click="confirme(false)">Não</b-button>
    </b-modal>

    <h3 v-if="groupSessions.length === 0">Não existem sessões de grupos para os utilizadores selecionados.</h3>

    <b-card
      v-for="gs in groupSessions"
      :key="gs.pk"
      border-variant="dark"
      header="Sessão de Grupo"
    >
      <FormGroupSession
        v-if="editingGroupSession"
        :groupSessionData="groupSession"
        @returnGroupSession="beforeUpdateGroupSession"
      ></FormGroupSession>
      <div v-if="!editingGroupSession">
        <b-card-text align="left">{{ gs.groupSession.theme }}</b-card-text>
        <b-card-text align="left">{{ gs.groupSession.description }}</b-card-text>
        <b-button variant="danger" @click="remove(gs.pk)">Eliminar</b-button>
        <b-button @click="edit(gs.pk)">Editar</b-button>
      </div>
    </b-card>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import FormGroupSession from './FormGroupSession'

export default {
  name: 'listGroupSessions',
  components: {
    FormGroupSession
  },
  props: {
  },
  data: () => ({
    groupSessionToRemove: null,
    editingGroupSession: null
  }),
  created () {
    if (this.usersActive.caregivers.length !== 0 || this.usersActive.patients.length !== 0) {
      this.$store.dispatch('groupSessions/getGroupSessions', this.usersActive)
    }
  },
  computed: {
    ...mapState({
      groupSessions: state => state.groupSessions.groupSessions,
      usersActive: state => state.users.usersActive
    })
  },
  methods: {
    ...mapActions('groupSessions', ['updateGroupSession', 'deleteGroupSession']),
    log (info) {
      console.log(info)
    },
    edit (groupSessionPK) {
      this.editingGroupSession = groupSessionPK
    },
    remove (groupSessionPK) {
      this.groupSessionToRemove = groupSessionPK
      this.showModal()
    },
    showModal () {
      this.$refs['my-modal'].show()
    },
    confirme (bool) {
      if (bool === true) {
        console.log('deleting groupSession with PK =', this.groupSessionToRemove)
        this.deleteGroupSession(this.groupSessionToRemove)
      }
      this.groupSessionToRemove = null
      this.$refs['my-modal'].hide()
    },
    beforeUpdateGroupSession (groupSession) {
      this.editingGroupSession = null
      this.updateGroupSession(groupSession)
    }
  }
}
</script>
