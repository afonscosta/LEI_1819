<template>
  <div>
    <notifications 
      position="top center"
      classes="notif-success"
      :speed="500"
      :width="450"
      animation-name="v-fade-top"
      group="success"
    />
    <notifications 
      position="top center"
      classes="notif-error"
      :speed="500"
      :width="450"
      animation-name="v-fade-top"
      group="error"
    />

    <b-button @click="$router.push({ name: 'goals' })">Objetivos</b-button>
    <b-button @click="$router.push({ name: 'activities' })">Atividades</b-button>
    <b-container>
      <b-row>
        <b-col>
          <h3>Consultar hábitos dos cuidadores</h3>
        </b-col>
      </b-row>
      <b-card>
        <b-form @submit="onSubmitSearch">
          <b-row>
            <b-col cols="10">
              <b-form-select required v-model="selectedCaregiver" :options="caregiversParsed">
                <template slot="first">
                  <option :value="null">-- Selecione um cuidador --</option>
                </template>
              </b-form-select>
            </b-col>
            <b-col cols="2">
                <b-button type="submit" variant="primary">Pesquisar</b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-card>

      <b-row class="mt-3">
        <b-col>
          <b-card v-if="Object.keys(goalsCaregiver).length > 0" class="mb-1"
            header="Objetivos semanais"
            header-tag="header"
          >
            <b-card class="mb-3" no-body v-for="key in Object.keys(goalsCaregiver)" :key="key">
              <p class="mt-2"><strong>Tipo:</strong> {{ goalsCaregiver[key].type }}</p>
              <p><strong>Objetivo:</strong> {{ goalsCaregiver[key].goal }}</p>
              <p><strong>Realizadas:</strong> {{ goalsCaregiver[key].realized }}</p>
            </b-card>
          </b-card>
        </b-col>
      </b-row>

      <div class="mt-3" role="tablist">
        <b-card v-if="activities.length > 0" no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle.accordion-1>Atividades</b-button>
          </b-card-header>
          <b-collapse id="accordion-1" role="tabpanel">
            <b-card-body>
              <b-card
                v-for="act in activities"
                :key="'act' + act.pk"
                border-variant="dark"
                :header="act.act"
              >
                <p>Data: {{ (new Date(act.date)).toLocaleDateString('en-GB') }}</p>
                <p>Duração: {{ act.duration }}</p>
              </b-card>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card v-if="meal.length > 0" no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle.accordion-2>Refeições</b-button>
          </b-card-header>
          <b-collapse id="accordion-2" role="tabpanel">
            <b-card-body>
              <b-card
                v-for="m in meal"
                :key="'meal' + m.pk"
                border-variant="dark"
                :header="m.type"
              >
                <p>Data: {{ (new Date(m.date)).toLocaleDateString('en-GB') }}</p>
                <p>Realizado: {{ m.done ? 'Sim' : 'Não' }}</p>
                <p v-if="m.food.length > 0">Comida: {{ m.food }}</p>
              </b-card>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card v-if="water.length > 0" no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle.accordion-3>Água</b-button>
          </b-card-header>
          <b-collapse id="accordion-3" role="tabpanel">
            <b-card-body>
              <b-card
                v-for="w in water"
                :key="'water' + w.pk"
                border-variant="dark"
                :header="(new Date(w.date)).toLocaleDateString('en-GB')"
              >
                <p>Quantidade: {{ w.water }} copos</p>
              </b-card>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card v-if="sos.length > 0" no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle.accordion-4>Medicamento SOS</b-button>
          </b-card-header>
          <b-collapse id="accordion-4" role="tabpanel">
            <b-card-body>
              <b-card
                v-for="s in sos"
                :key="'sos' + s.pk"
                border-variant="dark"
                :header="(new Date(s.date)).toLocaleDateString('en-GB')"
              >
                <p>Quantidade: {{ s.sos }}</p>
              </b-card>
            </b-card-body>
          </b-collapse>
        </b-card>

        <b-card v-if="sleep.length > 0 || nap.length > 0" no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle.accordion-5>Sono</b-button>
          </b-card-header>
          <b-collapse id="accordion-5" role="tabpanel">
            <b-card-body>
              <b-card
                v-for="s in sleep"
                :key="'sleep' + s.pk"
                border-variant="dark"
                :header="(new Date(s.date)).toLocaleDateString('en-GB')"
              >
                <p>Dormiu mais de 7 horas? {{ s.quantity ? 'Sim' : 'Não' }}</p>
              </b-card>
              <b-card
                v-for="n in nap"
                :key="'nap' + n.pk"
                border-variant="dark"
                :header="(new Date(n.date)).toLocaleDateString('en-GB')"
              >
                <p>Sestas: {{ n.naps }}</p>
              </b-card>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import format from 'date-fns/format'
import Goals from './Goals/Goals'

export default {
  name: 'Habits',
  components: {
    Goals
  },
  data: () => ({
    selectedCaregiver: null
  }),
  created () {
    this.$store.dispatch('users/getCaregivers')
  },
  computed: {
    ...mapState({
      caregivers: state => state.users.users.caregivers,
      activities: state => state.habits.userActivities,
      meal: state => state.habits.userMeal,
      water: state => state.habits.userWater,
      sos: state => state.habits.userSOS,
      sleep: state => state.habits.userSleep,
      nap: state => state.habits.userNap,
      goalsCaregiver: state => state.habits.goalsCaregiver
    }),
    caregiversParsed () {
      // TODO: Será que é esta pk?
      return this.caregivers.map((c) => {
        return { value: c.pk, text: c.info.name }
      })
    }
  },
  methods: {
    onSubmitSearch (evt) {
      evt.preventDefault()
      this.$store.dispatch('habits/getHabits', this.selectedCaregiver)
      this.$store.dispatch('habits/getGoalsCaregiver', this.selectedCaregiver)
      console.log('search habits for ', this.selectedCaregiver)
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
.notif-success {
  margin: 10px;
  margin-bottom: 0;
  border-radius: 3px;
  padding: 10px 20px;
  background: #E8F9F0;
  border: 2px solid #D0F2E1;
}

.notif-error {
  margin: 10px;
  margin-bottom: 0;
  border-radius: 3px;
  padding: 10px 20px;
  background: #F9E8E8;
  border: 2px solid #FCF2F2;
}

.notification-title {
  letter-spacing: 1px;
  font-size: 17px;
  text-align: center;
}

.v-fade-top-enter-active,
.v-fade-top-leave-active,
.v-fade-ltopmove {
  transition: all .5s;
}
.v-fade-top-enter,
.v-fade-top-leave-to {
  opacity: 0;
  transform: translateY(-500px) scale(0.2);
}
.vdatetime-input {
  width: 100%;
}
</style>
