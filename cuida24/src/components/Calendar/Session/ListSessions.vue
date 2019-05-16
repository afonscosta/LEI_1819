<template>
  <div>
    <b-modal 
      ref="modal-group"
      hide-footer title="Eliminação de sessão de grupo"
    >
      <div class="d-block text-center">
        <h3>Tem a certeza que pretende eliminar a sessão de grupo?</h3>
      </div>
      <b-button class="mt-2" variant="success" block @click="confirme('group', false)">Não</b-button>
      <b-button class="mt-3" variant="danger" block @click="confirme('group', true)">Sim</b-button>
    </b-modal>

    <b-modal 
      ref="modal-indiv"
      hide-footer title="Eliminação de sessão individual"
    >
      <div class="d-block text-center">
        <h3>Tem a certeza que pretende eliminar a sessão individual?</h3>
      </div>
      <b-button class="mt-2" variant="success" block @click="confirme('indiv', false)">Não</b-button>
      <b-button class="mt-3" variant="danger" block @click="confirme('indiv', true)">Sim</b-button>
    </b-modal>

    <b-modal 
      ref="modal-participants"
      hide-footer centered
      title="Participantes da Sessão"
    >
      <b-container>
        <b-row>
          <b-col>
            <p>Os utilizadores a <b><span style="color: #5FBA7D">verde</span></b> encontram-se inscritos na sessão de grupo.</p>
            <p v-if="(participantsCaregivers.length + participantsPatients.length) === 2" style="color: #E01325">Mínimo de participantes para a sessão de grupo foi atingido. Não pode ser removido mais nenhum utilizador.</p><br>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h5><b>Cuidadores</b></h5>
            <ListUsers 
              :listName="'Cuidadores'"
              :users="caregivers"
              :selected="participantsCaregivers"
              :readOnly="!editingPartiMode"
              @removeSelected="removeSelectedCaregiver"
              @addSelected="addSelectedCaregiver"
            ></ListUsers>
          </b-col>
          <b-col>
            <h5><b>Utentes</b></h5>
            <ListUsers 
              :listName="'Utentes'"
              :users="patients"
              :selected="participantsPatients"
              :readOnly="!editingPartiMode"
              @removeSelected="removeSelectedPatient"
              @addSelected="addSelectedPatient"
            ></ListUsers>
          </b-col>
        </b-row>
      </b-container>
      <b-button
        v-if="!editingPartiMode"
        class="mt-2"
        block
        @click="editingPartiMode = true"
      >Editar</b-button>
      <b-button v-if="editingPartiMode" class="mt-2" variant="success" block @click="confirme('part', false)">Não</b-button>
      <b-button v-if="editingPartiMode" class="mt-3" variant="danger" block @click="confirme('part', true)">Sim</b-button>
    </b-modal>

    <b-container>
      <b-row class="justify-content-md-center">
        <b-col xl="8" lg="8" md="8" sm="12" cols="12">
          <b-button 
            @click="goToFormSession"
            v-if="(usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0) && (usersActive.caregivers.length + usersActive.patients.length) === 1"
          >Adicionar Sessão Individual</b-button>
          <b-button 
            @click="goToFormSession"
            v-if="(usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0) && (usersActive.caregivers.length + usersActive.patients.length) > 1"
          >Adicionar Sessão de Grupo</b-button>
        </b-col>
      </b-row>
    </b-container>

    <b-container
      v-if="usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0"
    >
      <b-row class="justify-content-md-center">
        <b-col xl="8" lg="8" md="8" sm="12" cols="12">
          <h3 v-if="groupSessions.length === 0 && indivSessions.length === 0 && (usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0)">Não existem sessões para os utilizadores selecionados.</h3>

          <ListGroupSessions
            @removeGroupSession="removeGroupSession"
            @editGroupSession="editGroupSession"
            @editParticipants="editParticipants"
          />

          <ListIndivSessions
            @removeIndivSession="removeIndivSession"
            @editIndivSession="editIndivSession"
          />

        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import FormSession from './FormSession'
import ListGroupSessions from './ListGroupSessions'
import ListIndivSessions from './ListIndivSessions'
import ListUsers from '@/components/ListUsers'

export default {
  name: 'listSessions',
  components: {
    FormSession,
    ListGroupSessions,
    ListIndivSessions,
    ListUsers
  },
  props: {
  },
  data: () => ({
    groupSessionToRemove: null,
    updateGSParticipants: null,
    indivSessionToRemove: null,
    participantsCaregivers: [],
    participantsPatients: [],
    editingPartiMode: false
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
      usersActive: state => state.users.usersActive,
      caregivers: state => state.users.users.caregivers,
      patients: state => state.users.users.patients
    }),
    ...mapGetters('users', [
      'getCaregiverByInfoId',
      'getPatientByInfoId'
    ]),
    durationUnitTranslated () {
      return (durationUnit) => {
        if (durationUnit === 'minutes') {
          return 'minuto(s)'
        } else if (durationUnit === 'hours') {
          return 'hora(s)'
        } else if (durationUnit === 'days') {
          return 'dia(s)'
        } else if (durationUnit === 'weeks') {
          return 'semana(s)'
        } else if (durationUnit === 'months') {
          return 'mês(es)'
        }
      }
    },
    parseState () {
      return (state) => {
        if (state === 'E') {
          return 'À espera de aprovação'
        } else if (state === 'A') {
          return 'Aprovada'
        } else if (state === 'R') {
          return 'Necessária revisão'
        } else if (state === 'C') {
          return 'Já foi realizada'
        }
      }
    }
  },
  watch: {
    editingPartiMode: function (val) {
      if (this.editingPartiMode) {
        this.participantsCaregivers = this.updateGSParticipants.event.participants
          .filter(p => this.isCaregiver(p.pk))
          .map(p => this.getCaregiverByInfoId(p.pk))

        this.participantsPatients = this.updateGSParticipants.event.participants
          .filter(p => this.isPatient(p.pk))
          .map(p => this.getPatientByInfoId(p.pk))
      } else {
        this.participantsCaregivers = []
        this.participantsPatients = []
      }
    }
  },
  methods: {
    ...mapActions('sessions', [
      'updateIndivSession',
      'deleteIndivSession',
      'updateGroupSession',
      'deleteGroupSession',
      'dontShowGroupSession'
    ]),
    editGroupSession (gs) {
      this.$emit('editGroupSession', gs)
    },
    removeGroupSession (gs) {
      this.groupSessionToRemove = gs
      this.showModal('modal-group')
    },
    editParticipants (gs) {
      this.participantsCaregivers = gs.event.participants
        .filter(p => this.isCaregiver(p.pk))
        .map(p => this.getCaregiverByInfoId(p.pk))

      this.participantsPatients = gs.event.participants
        .filter(p => this.isPatient(p.pk))
        .map(p => this.getPatientByInfoId(p.pk))

      this.participantsCaregivers = this.participantsCaregivers.filter(p => p !== null)
      this.participantsPatients = this.participantsPatients.filter(p => p !== null)
      this.updateGSParticipants = gs
      this.showModal('modal-participants')
    },
    editIndivSession (is) {
      this.$emit('editIndivSession', is)
    },
    removeIndivSession (is) {
      this.indivSessionToRemove = is
      this.showModal('modal-indiv')
    },
    showModal (type) {
      this.$refs[type].show()
    },
    confirme (type, bool) {
      if (type === 'group') {
        if (bool === true) {
          console.log('deleting groupSession with PK =', this.groupSessionToRemove.groupSession.pk)
          this.deleteGroupSession(this.groupSessionToRemove)
        }
        this.groupSessionToRemove = null
        this.$refs['modal-group'].hide()
      } else if (type === 'indiv') {
        if (bool === true) {
          console.log('deleting indivSession with PK =', this.indivSessionToRemove.individualSession.pk)
          this.deleteIndivSession(this.indivSessionToRemove)
        }
        this.indivSessionToRemove = null
        this.$refs['modal-indiv'].hide()
      } else if (type === 'part') {
        if (bool === true) {
          console.log('updating participants of group session with PK =', this.updateGSParticipants.groupSession.pk)
          let gs = JSON.parse(JSON.stringify(this.updateGSParticipants))
          delete this.updateGSParticipants.event.participants
          this.updateGSParticipants.event.users = {
            caregivers: this.participantsCaregivers.map(u => u.pk),
            patients: this.participantsPatients.map(u => u.pk)
          }
          gs.event.participants = []
          gs.event.participants.push(...this.participantsCaregivers.map(u => ({ name: u.info.name, pk: u.info.pk })))
          gs.event.participants.push(...this.participantsPatients.map(u => ({ name: u.info.name, pk: u.info.pk })))
          let remove = true
          console.log('partCare', this.participantsCaregivers)
          console.log('partPat', this.participantsPatients)
          console.log('caregivers', this.usersActive.caregivers)
          for (let i in this.usersActive.caregivers) {
            if (this.participantsCaregivers.find(p => p.pk === this.usersActive.caregivers[i])) {
              remove = false
              break
            }
          }
          if (remove) {
            for (let i in this.usersActive.patients) {
              if (this.participantsPatients.find(p => p.pk === this.usersActive.patients[i])) {
                remove = false
                break
              }
            }
          }
          if (remove) {
            console.log('enter remove')
            this.dontShowGroupSession(gs)
            this.updateGroupSession({ send: this.updateGSParticipants, stay: null })
          } else {
            console.log('stay', gs)
            console.log('send', this.updateGSParticipants)
            this.updateGroupSession({ send: this.updateGSParticipants, stay: gs })
            this.$emit('groupSessionUpdated', this.updateGSParticipants.event.occurrenceDate)
          }
        }
        this.updateGSParticipants = null
        this.editingPartiMode = false
        this.$refs['modal-participants'].hide()
      }
    },
    beforeUpdateGroupSession (gs) {
      this.editingGroupSession = null
      this.updateGroupSession(gs)
    },
    beforeUpdateIndivSession (is) {
      this.editingIndivSession = null
      this.updateIndivSession(is)
    },
    removeSelectedCaregiver (userPK) {
      if ((this.participantsCaregivers.length + this.participantsPatients.length) > 2) {
        this.participantsCaregivers = this.participantsCaregivers.filter(u => u.pk !== userPK)
      }
    },
    addSelectedCaregiver (user) {
      this.participantsCaregivers.push(user)
    },
    removeSelectedPatient (userPK) {
      if ((this.participantsCaregivers.length + this.participantsPatients.length) > 2) {
        this.participantsPatients = this.participantsPatients.filter(u => u.pk !== userPK)
      }
    },
    addSelectedPatient (user) {
      this.participantsPatients.push(user)
    },
    goToFormSession () {
      this.$router.push({ name: 'formSession' })
    },
    isCaregiver (id) {
      if (this.caregivers.find(u => u.info.pk === id)) {
        console.log('is caregiver', id)
        return true
      }
      return false
    },
    isPatient (id) {
      if (this.patients.find(u => u.info.pk === id)) {
        console.log('is patient', id)
        return true
      }
      return false
    }
  }
}
</script>
