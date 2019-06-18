<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <h3>Adicionar novo objetivo</h3>
        </b-col>
      </b-row>
      <b-card>
        <b-form @submit="onSubmit" @reset="onReset">
          <b-row>
            <b-col align="left">
              <div class="datepicker-trigger">
                <label for="input-goal">Intervalo em que o objetivo está ativo:</label>
                <input
                  type="text"
                  id="datepicker-trigger"
                  placeholder="Selecione um intervalo"
                  :value="formatDates(dateOne, dateTwo)"
                  required
                >
                <AirbnbStyleDatepicker
                  :trigger-element-id="'datepicker-trigger'"
                  :mode="'range'"
                  :fullscreen-mobile="true"
                  :date-one="dateOne"
                  :date-two="dateTwo"
                  @date-one-selected="val => { dateOne = val }"
                  @date-two-selected="val => { dateTwo = val }"
                />
              </div>
            </b-col>
            <b-col>
              <b-form-select required v-model="selected" :options="goalTypes">
                <template slot="first">
                  <option :value="null">-- Selecione um objetivo --</option>
                </template>
              </b-form-select>
              <b-row class="mt-3 mb-3">
                <b-col>
                  <label for="input-goal">Quantidade a realizar:</label>
                </b-col>
                <b-col>
                  <b-form-input
                    id="input-goal"
                    v-model="goal"
                    type="number"
                    placeholder="Insira uma quantidade"
                    required
                  ></b-form-input>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
                <b-button type="reset" variant="danger">Limpar</b-button>
                <b-button type="submit" variant="primary">Submeter</b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import format from 'date-fns/format'

export default {
  name: 'FormGoal',
  data: () => ({
    selected: null,
    goal: null,
    dateOne: '',
    dateTwo: '',
    dateFormat: 'D MMM'
  }),
  computed: {
    ...mapState({
      goalTypes: state => state.habits.goalTypes
    })
  },
  methods: {
    ...mapActions('habits', ['addGoal']),
    onSubmit () {
      var dateBegin = new Date(this.dateOne)
      var dateEnd = new Date(this.dateTwo)
      this.addGoal({
        goal: this.goal,
        type: this.selected,
        dateBegin: dateBegin.toISOString(),
        dateEnd: dateEnd.toISOString()
      })
        .then(() => {
          this.$notify({
            title: 'O objetivo semanal foi adicionado com sucesso.',
            duration: 3000,
            group: 'success'
          })
          this.onReset()
        })
        .catch(() => {
          this.$notify({
            title: 'Ocorreu um erro ao adicionar o objetivo semanal.',
            duration: 3000,
            group: 'error'
          })
        })
    },
    onReset () {
      this.selected = null
      this.goal = 0
      this.dateOne = ''
      this.dateTwo = ''
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
.datepicker-container {
  margin-bottom: 30px;
}
input {
  padding: 6px 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.inline-with-input {
  width: 100%;
}
.inline-with-input input {
  width: 100%;
}
.container {
  overflow: -webkit-paged-y;
}
</style>
