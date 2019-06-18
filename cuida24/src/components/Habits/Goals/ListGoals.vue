<template>
  <div>
    <b-container>
      <p v-if="goals.length === 0">Não existem objetivos registados</p>
      <b-card v-if="goals.length > 0" v-for="g in goals" :key="g.pk">
        <b-row align-v="center">
          <b-col align="left" align-self="center">
            <p><strong>Objetivo:</strong> {{ parseGoalType(g.type) }}</p>
            <p class="mb-0"><strong>Quantidade a realizar:</strong> {{ g.goal }}</p>
          </b-col>
          <b-col align-self="center">
            <b-button variant="danger" @click="beforeDeleteGoal(g.pk)">Eliminar</b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import format from 'date-fns/format'

export default {
  name: 'ListGoals',
  data: () => ({
  }),
  created () {
  },
  computed: {
    ...mapState({
      goals: state => state.habits.goals,
      goalTypes: state => state.habits.goalTypes
    })
  },
  methods: {
    ...mapActions('habits', ['deleteGoal']),
    beforeDeleteGoal (pk) {
      this.deleteGoal(pk)
        .then(() => {
          this.$notify({
            title: 'O objetivo semanal foi eliminado com sucesso.',
            duration: 3000,
            group: 'success'
          })
        })
        .catch(() => {
          this.$notify({
            title: 'Ocorreu um erro ao eliminar o objetivo semanal.',
            duration: 3000,
            group: 'error'
          })
        })
    },
    parseGoalType (type) {
      // eslint-disable-next-line
      var gt = this.goalTypes.find(gt => gt.value == type)
      if (gt) {
        return gt.text
      }
      return 'Objetivo não foi reconhecido'
    },
    formatDates (dateOne, dateTwo) {
      let formattedDates = ''
      if (dateOne) {
        formattedDates = format(dateOne, this.dateFormat)
      }
      if (dateTwo) {
        formattedDates += ' - ' + format(dateTwo, this.dateFormat)
      }
      return formattedDates
    }
  }
}
</script>

<style>
</style>
