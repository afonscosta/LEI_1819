<template>
  <b-container>
    <b-row class="justify-content-md-center">
      <b-col xl="8" lg="8" md="8" sm="12" cols="12">
        <b-card
          v-for="appt in appointments"
          border-variant="dark"
          :header="appt.event.data.title"
        >
          <b-card-text align="left">
            <b>Especialidade:</b> {{ appt.event.data.description }}
          </b-card-text>
          <b-card-text align="left">
            <b>Data:</b> {{ appt.occurrenceDate.dayOfMonth + '/' + appt.occurrenceDate.month + '/' + appt.occurrenceDate.year }}
          </b-card-text>
          <b-card-text v-if="appt.event.schedule.times" align="left">
            <b>Hora:</b> {{ appt.event.schedule.times[0] }}
          </b-card-text>
          <b-card-text v-if="!appt.event.schedule.times" align="left">
            <b>Duração:</b> Todo o dia
          </b-card-text>
          <b-card-text v-if="appt.event.schedule.duration" align="left">
            <b>Duração:</b> {{ appt.event.schedule.duration + " " + durationUnitTranslated(appt.event.schedule.durationUnit) }}
          </b-card-text>
          <b-card-text align="left">
            <b>Localização:</b> {{ appt.event.data.location }}
          </b-card-text>
          <b-button @click="edit(appt.appointmentPK)">Editar</b-button>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'listAppoints',
  components: {
  },
  props: {
  },
  data: () => ({
  }),
  created () {
    this.$store.dispatch('appointments/getAppointments', this.usersActive)
  },
  computed: {
    ...mapState({
      appointments: state => state.appointments.appointments,
      usersActive: state => state.users.usersActive
    }),
    ...mapGetters('appointments', [
      'getAppointmentsById'
    ]),
    durationUnitTranslated () {
      return (durationUnit) => {
        if (durationUnit === 'minutes') {
          return 'minuto(s)'
        } else if (durationUnit === 'days') {
          return 'dia(s)'
        } else if (durationUnit === 'weeks') {
          return 'semana(s)'
        } else if (durationUnit === 'months') {
          return 'mês(es)'
        }
      }
    }
  },
  methods: {
    log (info) {
      console.log(info)
    },
    edit (apptPK) {
      this.$emit(
        'editAppointment',
        this.getAppointmentsById(apptPK)
      )
    }
  }
}
</script>
