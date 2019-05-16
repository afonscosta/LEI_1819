<template>
  <div>
    <h3 v-if="groupSessions.length !== 0 && indivSessions.length === 0 && (usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0)">Não existem sessões individuais para o(s) utilizador(es) selecionado(s).</h3>

    <b-card
      v-for="is in indivSessions"
      :key="is.pk"
      border-variant="dark"
      header="Sessão Individual"
    >
      <b-container>
        <b-row align-v="center" class="justify-content-md-center">
          <b-col md="7" cols="12">
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
            <b-card-text align="left"><b>Estado:</b> {{ parseState(is.individualSession.state) }}</b-card-text>
          </b-col>
          <b-col md="5" cols="12">
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
              <b>Participante:</b> {{ is.event.participants[0].name }}
            </b-card-text>
          </b-col>
        </b-row>
      </b-container>
      <b-button variant="danger" @click="removeIndivSession(is)">Eliminar</b-button>
      <b-button @click="editIndivSession(is)">Editar</b-button>
    </b-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ListIndivSessions',
  computed: {
    ...mapState({
      groupSessions: state => state.sessions.groupSessions,
      indivSessions: state => state.sessions.indivSessions,
      usersActive: state => state.users.usersActive
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
    }
  },
  methods: {
    removeIndivSession (is) {
      this.$emit('removeIndivSession', is)
    },
    editIndivSession (is) {
      this.$emit('editIndivSession', is)
    }
  }
}
</script>
