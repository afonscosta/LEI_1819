<template>
  <div>
    <b-modal 
      ref="modal-comment"
      hide-footer title="Comentário para revisão da sessão"
    >
      <b-form @submit.prevent="onSubmit">
        <b-form-textarea
          id="textarea"
          v-model="comment"
          placeholder="Insira um comentário..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
        <b-button class="mt-2" block type="submit" variant="primary">Submit</b-button>
      </b-form>
      <b-button class="mt-2" block @click="$refs['modal-comment'].hide()">Cancelar</b-button>
    </b-modal>

    <b-card
      border-variant="dark"
      header="Sessão Individual"
      no-body
    >
      <b-container>
        <b-row align-v="center" align-h="start" class="justify-content-md-center">
          <b-col xl="4" cols="12">
            <b-card-text align="left"><b>Tema:</b> {{ indivS.individualSession.theme }}</b-card-text>
            <b-card-text align="left"><b>Descrição:</b> {{ indivS.individualSession.description }}</b-card-text>
            <b-card-text align="left"><b>Objetivos:</b>
              <ul>
                <li v-for="(goal, idx) in indivS.individualSession.goals">
                  {{ goal }}
                </li>
              </ul>
            </b-card-text>
            <b-card-text align="left"><b>Material necessário:</b> 
              <ul>
                <li v-for="(item, idx) in indivS.individualSession.materials">
                  {{ item }}
                </li>
              </ul>
            </b-card-text>
          </b-col>
          <b-col xl="5" cols="12">
            <b-card-text align="left"><b>Estado:</b> {{ parseState(indivS.individualSession.state) }}</b-card-text>
            <b-card-text align="left"><b>Data:</b> {{ indivS.event.occurrenceDate.dayOfMonth + '/' + indivS.event.occurrenceDate.month + '/' + indivS.event.occurrenceDate.year }}</b-card-text>
            <b-card-text v-if="indivS.event.schedule.times" align="left">
              <b>Hora de início:</b> {{ indivS.event.schedule.times[0] }}
            </b-card-text>
            <b-card-text v-if="!indivS.event.schedule.times" align="left">
              <b>Duração:</b> Todo o dia
            </b-card-text>
            <b-card-text v-if="indivS.event.schedule.duration" align="left">
              <b>Duração:</b> {{ indivS.event.schedule.duration + " " + durationUnitTranslated(indivS.event.schedule.durationUnit) }}
            </b-card-text>
            <b-card-text align="left">
              <b>Localização:</b> {{ indivS.event.data.location }}
            </b-card-text>
            <b-card-text align="left">
              <b>Participante:</b> {{ userName(indivS) }}
            </b-card-text>
          </b-col>
          <b-col xl="3" cols="12">
            <b-button block 
              variant="primary" 
              @click="cancel"
            >Cancelar</b-button>
            <b-button block 
              v-if="indivS.individualSession.state === 'E'"
              size="sm" 
              variant="primary" 
              @click="$refs['modal-comment'].show()"
            >Pedir revisão</b-button>
            <b-button block 
              v-if="indivS.individualSession.state === 'E'"
              size="sm" 
              variant="primary" 
              @click="approveSession(indivS)"
            >Aprovar sessão</b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ReviewIndivSession',
  props: {
    indivS: {
      required: true,
      type: Object
    }
  },
  data: () => ({
    comment: ''
  }),
  computed: {
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
  methods: {
    onSubmit () {
      this.$emit('addComment', this.comment)
      this.$refs['modal-comment'].hide()
    },
    cancel () {
      this.$emit('cancel')
    },
    userName (is) {
      if (is.event.users.caregivers.length > 0) {
        return this.getCaregiverByInfoId(is.event.users.caregivers[0]).info.name
      } else if (is.event.users.patients.length > 0) {
        return this.getPatientByInfoId(is.event.users.patients[0]).info.name
      }
    },
    approveSession (is) {
      this.$emit('approveSession', is)
    }
  }
}
</script>
