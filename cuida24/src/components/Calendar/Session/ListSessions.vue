<template>
  <div>
    <!--Modal delete group session-->
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

    <!--Modal delete individual session-->
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

    <!--Modal edit participants-->
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
      <b-button v-if="editingPartiMode" class="mt-2" variant="success" block @click="confirme('part', false)">Cancelar</b-button>
      <b-button v-if="editingPartiMode" class="mt-3" variant="danger" block @click="confirme('part', true)">Guardar</b-button>
    </b-modal>

    <!--Filter options + Button to add new session-->
    <b-container
      v-if="usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0">
      <b-row class="justify-content-md-center">
        <b-col xl="8" lg="8" md="8" sm="12" cols="12">
          <b-form-checkbox-group
            v-model="selectedStateFilters"
            :options="filterStateOptions"
            name="stateFilters"
            buttons
          ></b-form-checkbox-group>
          <b-button 
            @click="goToFormSession"
            v-if="(usersActive.caregivers.length + usersActive.patients.length) === 1"
          >Adicionar Sessão Individual</b-button>
          <b-button 
            @click="goToFormSession"
            v-if="(usersActive.caregivers.length + usersActive.patients.length) > 1"
          >Adicionar Sessão de Grupo</b-button>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col xl="8" lg="8" md="8" sm="12" cols="12">
          <b-form-checkbox-group
            v-model="selectedSessionTypes"
            :options="sessionTypesOptions"
            name="sessionTypes"
            buttons
          ></b-form-checkbox-group>
        </b-col>
      </b-row>
    </b-container>

    <!--List/Reviews of group/indiv sessions-->
    <b-container
      v-if="usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0"
    >
      <b-row class="justify-content-md-center">
        <b-col xl="8" lg="8" md="8" sm="12" cols="12">
          <h3 v-if="groupSessions.length === 0 && indivSessions.length === 0">
            Não existem sessões para os utilizadores selecionados.</h3>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col xl="8" lg="8" md="8" sm="12" cols="12">
          <ReviewGroupSession
            v-if="reviewGroupSession !== null"
            :gs="reviewGroupSession"
            @addComment="changeGSToReviewState"
            @approveSession="approveGroupSession"
            @cancel="cancelReviewGroupSession"
          />
          <ReviewIndivSession
            v-if="reviewIndivSession !== null"
            :indivS="reviewIndivSession"
            @addComment="changeISToReviewState"
            @approveSession="approveIndivSession"
            @cancel="cancelReviewIndivSession"
          />
        </b-col>
      </b-row>
      <b-row v-if="reviewGroupSession === null && reviewIndivSession === null" class="justify-content-md-center">
        <b-col md="6" cols="12">
          <ListGroupSessions
            v-if="selectedSessionTypes.includes('G') || selectedSessionTypes.length === 0"
            :filters="selectedStateFilters"
            @removeGroupSession="removeGroupSession"
            @editGroupSession="editGroupSession"
            @editParticipants="editParticipants"
            @reviewSession="startReviewGroupSession"
          />
        </b-col>
        <b-col md="6" cols="12">
          <ListIndivSessions
            v-if="selectedSessionTypes.includes('I') || selectedSessionTypes.length === 0"
            :filters="selectedStateFilters"
            @removeIndivSession="removeIndivSession"
            @editIndivSession="editIndivSession"
            @reviewSession="startReviewIndivSession"
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
import ReviewGroupSession from './ReviewGroupSession'
import ReviewIndivSession from './ReviewIndivSession'
import ListUsers from '@/components/ListUsers'

export default {
  name: 'listSessions',
  components: {
    FormSession,
    ListGroupSessions,
    ListIndivSessions,
    ReviewGroupSession,
    ReviewIndivSession,
    ListUsers
  },
  props: {
  },
  data: () => ({
    reviewGroupSession: null,
    reviewIndivSession: null,
    groupSessionToRemove: null,
    updateGSParticipants: null,
    indivSessionToRemove: null,
    participantsCaregivers: [],
    participantsPatients: [],
    editingPartiMode: false,
    selectedStateFilters: [],
    filterStateOptions: [
      { text: 'Espera', value: 'E' },
      { text: 'Revisão', value: 'R' },
      { text: 'Aceite', value: 'A' },
      { text: 'Concluída', value: 'C' }
    ],
    selectedSessionTypes: [],
    sessionTypesOptions: [
      { text: 'Sessão de Grupo', value: 'G' },
      { text: 'Sessão individual', value: 'I' }
    ]
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
      'getCaregiverById',
      'getPatientById'
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
        this.participantsCaregivers = this.updateGSParticipants.event.users.caregivers
          .map(pk => this.getCaregiverById(pk))

        this.participantsPatients = this.updateGSParticipants.event.users.patients
          .map(pk => this.getPatientById(pk))
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
      this.participantsCaregivers = gs.event.users.caregivers
        .map(pk => this.getCaregiverById(pk))

      this.participantsPatients = gs.event.users.patients
        .map(pk => this.getPatientById(pk))
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
          this.$notify({
            title: 'A sessão de grupo foi eliminada com sucesso.',
            duration: 3000
          })
        }
        this.groupSessionToRemove = null
        this.$refs['modal-group'].hide()
      } else if (type === 'indiv') {
        if (bool === true) {
          console.log('deleting indivSession with PK =', this.indivSessionToRemove.individualSession.pk)
          this.deleteIndivSession(this.indivSessionToRemove)
          this.$notify({
            title: 'A sessão individual foi eliminada com sucesso.',
            duration: 3000
          })
        }
        this.indivSessionToRemove = null
        this.$refs['modal-indiv'].hide()
      } else if (type === 'part') {
        if (bool === true) {
          console.log('updating users of group session with PK =', this.updateGSParticipants.groupSession.pk)
          this.updateGSParticipants.event.users = {
            caregivers: this.participantsCaregivers.map(u => u.pk),
            patients: this.participantsPatients.map(u => u.pk)
          }
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
            this.dontShowGroupSession(this.updateGSParticipants)
            this.updateGroupSession(this.updateGSParticipants)
          } else {
            console.log('updateGroupSession', this.updateGSParticipants)
            this.updateGroupSession(this.updateGSParticipants)
          }
          this.$notify({
            title: 'Os participantes da sessão de grupo foram atualizados com sucesso.',
            duration: 3000
          })
        }
        this.updateGSParticipants = null
        this.editingPartiMode = false
        this.$refs['modal-participants'].hide()
      }
    },
    beforeUpdateGroupSession (gs) {
      this.editingGroupSession = null
      this.updateGroupSession(gs)
      this.$notify({
        title: 'A sessão de grupo foi atualizada com sucesso.',
        duration: 3000
      })
    },
    beforeUpdateIndivSession (is) {
      this.editingIndivSession = null
      this.updateIndivSession(is)
      this.$notify({
        title: 'A sessão individual foi atualizada com sucesso.',
        duration: 3000
      })
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
    changeGSToReviewState (comment) {
      this.reviewGroupSession.groupSession.comment = comment
      this.reviewGroupSession.groupSession.state = 'R'
      this.updateGroupSession(this.reviewGroupSession)
      this.$notify({
        title: 'A revisão da sessão de grupo foi submetida com sucesso.',
        duration: 3000
      })
      this.reviewGroupSession = null
    },
    changeISToReviewState (comment) {
      this.reviewIndivSession.individualSession.comment = comment
      this.reviewIndivSession.individualSession.state = 'R'
      this.updateIndivSession(this.reviewIndivSession)
      this.$notify({
        title: 'A revisão da sessão individual foi submetida com sucesso.',
        duration: 3000
      })
      this.reviewIndivSession = null
    },
    startReviewGroupSession (gs) {
      this.reviewGroupSession = gs
    },
    startReviewIndivSession (is) {
      this.reviewIndivSession = is
    },
    cancelReviewGroupSession () {
      this.reviewGroupSession = null
    },
    cancelReviewIndivSession () {
      this.reviewIndivSession = null
    },
    approveGroupSession (gs) {
      gs.groupSession.state = 'A'
      this.updateGroupSession(gs)
      this.$notify({
        title: 'A sessão de grupo foi aprovada com sucesso.',
        duration: 3000
      })
      this.reviewGroupSession = null
    },
    approveIndivSession (is) {
      is.individualSession.state = 'A'
      this.updateIndivSession(is)
      this.$notify({
        title: 'A sessão individual foi aprovada com sucesso.',
        duration: 3000
      })
      this.reviewIndivSession = null
    }
  }
}
</script>
