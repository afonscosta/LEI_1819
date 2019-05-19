<template>
  <div>
    <h3 v-if="groupSessions.length === 0 && indivSessions.length !== 0 && (usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0)">Não existem sessões de grupo para os utilizadores selecionados.</h3>

    <b-card
      v-for="gs in groupSessionsFilter"
      :key="gs.pk"
      border-variant="dark"
      header="Sessão de Grupo"
      no-body
    >
      <b-container>
        <b-row align-v="center" align-h="start" class="justify-content-md-center">
          <b-col xl="4" cols="12">
            <b-card-text align="left"><b>Tema:</b> {{ gs.groupSession.theme }}</b-card-text>
            <b-card-text align="left"><b>Descrição:</b> {{ gs.groupSession.description }}</b-card-text>
            <b-card-text align="left"><b>Objetivos:</b>
              <ul>
                <li v-for="(goal, idx) in gs.groupSession.goals">
                  {{ goal }}
                </li>
              </ul>
            </b-card-text>
            <b-card-text align="left"><b>Material necessário:</b> 
              <ul>
                <li v-for="(item, idx) in gs.groupSession.materials">
                  {{ item }}
                </li>
              </ul>
            </b-card-text>
          </b-col>
          <b-col xl="5" cols="12">
            <b-card-text align="left"><b>Estado:</b> {{ parseState(gs.groupSession.state) }}</b-card-text>
            <b-card-text align="left"><b>Data:</b> {{ gs.event.occurrenceDate.dayOfMonth + '/' + gs.event.occurrenceDate.month + '/' + gs.event.occurrenceDate.year }}</b-card-text>
            <b-card-text v-if="gs.event.schedule.times" align="left">
              <b>Hora de início:</b> {{ gs.event.schedule.times[0] }}
            </b-card-text>
            <b-card-text v-if="!gs.event.schedule.times" align="left">
              <b>Duração:</b> Todo o dia
            </b-card-text>
            <b-card-text v-if="gs.event.schedule.duration" align="left">
              <b>Duração:</b> {{ gs.event.schedule.duration + " " + durationUnitTranslated(gs.event.schedule.durationUnit) }}
            </b-card-text>
            <b-card-text align="left">
              <b>Localização:</b> {{ gs.event.data.location }}
            </b-card-text>
          </b-col>
          <b-col xl="3" cols="12">
            <b-button block class="mt-2" variant="danger" @click="removeGroupSession(gs)">Eliminar</b-button>
            <b-button block @click="editGroupSession(gs)">Editar</b-button>
            <b-button block size="sm" variant="primary" @click="editParticipants(gs)">Participantes</b-button>
            <b-button block size="sm" variant="primary" @click="goToEvaluation(gs)">Avaliar participantes</b-button>
            <b-button block 
              v-if="gs.groupSession.state === 'E'"
              size="sm" 
              variant="primary" 
              @click="reviewSession(gs)"
            >Rever sessão</b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ListGroupSessions',
  props: {
    filters: {
      required: true,
      type: Array
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
    },
    groupSessionsFilter () {
      let data = this.groupSessions
      if (this.filters.length === 0) {
        return data
      }
      return data.filter(gs => this.filters.includes(gs.groupSession.state))
    }
  },
  methods: {
    ...mapActions('sessions', [
      'updateGroupSession'
    ]),
    ...mapActions('evaluations', [
      'setSession'
    ]),
    removeGroupSession (gs) {
      this.$emit('removeGroupSession', gs)
    },
    editGroupSession (gs) {
      this.$emit('editGroupSession', gs)
    },
    editParticipants (gs) {
      this.$emit('editParticipants', gs)
    },
    reviewSession (gs) {
      this.$emit('reviewSession', gs)
    },
    goToEvaluation (gs) {
      this.setSession(gs)
      this.$router.push({ name: 'evaluation' })
    }
  }
}
</script>

<style>
@media (min-width: 576px) {
  b-button-group {
    vertical: false;
  }
}
</style>
