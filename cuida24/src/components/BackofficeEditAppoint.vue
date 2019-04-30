<template>
  <div>
    <b-card
      v-for="appt in appointments"
      border-variant="dark"
      :header="appt.details.title"
    >
      <b-card-text align="left"><b>Especialidade:</b> {{ appt.details.description }}</b-card-text>
      <b-card-text align="left"><b>Data e Hora da consulta:</b> DATA</b-card-text>
      <b-card-text align="left"><b>Localização:</b> {{ appt.details.location }}</b-card-text>
      <b-button @click="edit(appt.pk)">Editar</b-button>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'editAppoint',
  components: {
  },
  props: {
    userPK: Number
  },
  data: () => ({
  }),
  created () {
    this.$store.dispatch('appointments/getAppointments')
  },
  computed: {
    ...mapGetters('appointments', [
      'getAppointmentsByUserId'
    ]),
    appointments: function () {
      return this.getAppointmentsByUserId(this.userPK)
    }
  },
  methods: {
    log (info) {
      console.log(info)
    },
    edit (appointmentPK) {
      console.log('edit appointment with pk ' + appointmentPK)
    }
  }
}
</script>
