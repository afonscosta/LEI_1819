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
            <b-button block 
              variant="primary" 
              @click="cancel"
            >Cancelar</b-button>
            <b-button block 
              v-if="gs.groupSession.state === 'E'"
              size="sm" 
              variant="primary" 
              @click="$refs['modal-comment'].show()"
            >Pedir revisão</b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'ReviewGroupSession',
  props: {
    gs: {
      required: true,
      type: Object
    }
  },
  data: () => ({
    comment: ''
  }),
  computed: {
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
    }
  }
}
</script>
