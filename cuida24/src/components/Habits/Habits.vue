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
      caregivers: state => state.users.users.caregivers
    }),
    caregiversParsed () {
      // TODO: Será que é esta pk?
      return this.caregivers.map((c) => {
        return { value: c.pk, text: c.info.name }
      })
    }
  },
  methods: {
    onSubmitSearch () {
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
