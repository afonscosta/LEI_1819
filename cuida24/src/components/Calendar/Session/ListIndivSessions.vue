<template>
  <div>
    <h3 v-if="groupSessions.length !== 0 && indivSessions.length === 0 && (usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0)">Não existem sessões individuais para o(s) utilizador(es) selecionado(s).</h3>

    <b-card
      v-for="is in indivSessionsFilter"
      :key="is.pk"
      border-variant="dark"
      header="Sessão Individual"
      no-body
    >
      <b-container>
        <b-row align-v="center" align-h="start" class="justify-content-md-center">
          <b-col xl="4" cols="12">
            <b-card-text align="left"><b>Tema:</b> {{ is.individualSession.theme }}</b-card-text>
            <b-card-text align="left"><b>Descrição:</b> {{ is.individualSession.description }}</b-card-text>
            <b-card-text align="left"><b>Objetivos:</b>
              <ul>
                <li v-for="(goal, idx) in is.individualSession.goals">
                  {{ goal }}
                </li>
              </ul>
            </b-card-text>
            <b-card-text align="left"><b>Material necessário:</b> 
              <ul>
                <li v-for="(item, idx) in is.individualSession.materials">
                  {{ item }}
                </li>
              </ul>
            </b-card-text>
          </b-col>
          <b-col xl="5" cols="12">
            <b-card-text align="left"><b>Estado:</b> {{ parseState(is.individualSession.state) }}</b-card-text>
            <b-card-text align="left"><b>Data:</b> {{ is.event.occurrenceDate.dayOfMonth + '/' + is.event.occurrenceDate.month + '/' + is.event.occurrenceDate.year }}</b-card-text>
            <b-card-text v-if="is.event.schedule.times" align="left">
              <b>Hora de início:</b> {{ is.event.schedule.times[0] }}
            </b-card-text>
            <b-card-text v-if="!is.event.schedule.times" align="left">
              <b>Duração:</b> Todo o dia
            </b-card-text>
            <b-card-text v-if="is.event.schedule.duration" align="left">
              <b>Duração:</b> {{ is.event.schedule.duration + " " + durationUnitTranslated(is.event.schedule.durationUnit) }}
            </b-card-text>
            <b-card-text align="left">
              <b>Localização:</b> {{ is.event.data.location }}
            </b-card-text>
            <b-card-text align="left">
              <b>Participante:</b> {{ userName(is) }}
            </b-card-text>
          </b-col>
          <b-col xl="3" cols="12">
            <b-button block class="mt-2" variant="danger" @click="removeIndivSession(is)">Eliminar</b-button>
            <b-button block @click="editIndivSession(is)">Editar</b-button>
            <b-button block size="sm" variant="primary" @click="goToEvaluation(is)">Avaliar participante</b-button>
            <b-button block 
              v-if="is.individualSession.state === 'E'"
              size="sm" 
              variant="primary" 
              @click="reviewSession(is)"
            >Rever sessão</b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'ListIndivSessions',
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
      usersActive: state => state.users.usersActive
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
    },
    indivSessionsFilter () {
      let data = this.indivSessions
      if (this.filters.length === 0) {
        return data
      }
      return data.filter(is => this.filters.includes(is.individualSession.state))
    }
  },
  methods: {
    ...mapActions('sessions', [
      'updateIndivSession'
    ]),
    ...mapActions('evaluations', [
      'setSession'
    ]),
    removeIndivSession (is) {
      this.$emit('removeIndivSession', is)
    },
    editIndivSession (is) {
      this.$emit('editIndivSession', is)
    },
    reviewSession (is) {
      this.$emit('reviewSession', is)
    },
    userName (is) {
      if (is.event.users.caregivers.length > 0) {
        return this.getCaregiverById(is.event.users.caregivers[0]).info.name
      } else if (is.event.users.patients.length > 0) {
        return this.getPatientById(is.event.users.patients[0]).info.name
      }
    },
    goToEvaluation (is) {
      this.setSession(is)
      this.$router.push({ name: 'evaluation' })
    }
  }
}
</script>
