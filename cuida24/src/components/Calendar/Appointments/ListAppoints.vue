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

    <div>
      <b-modal 
        ref="my-modal"
        hide-footer title="Eliminação de consulta"
      >
        <div class="d-block text-center">
          <h3>Tem a certeza que pretende eliminar a consulta?</h3>
        </div>
        <b-button class="mt-2" variant="success" block @click="confirme(false)">Não</b-button>
        <b-button class="mt-3" variant="danger" block @click="confirme(true)">Sim</b-button>
      </b-modal>
    </div>
    <b-container>
      <b-row class="justify-content-md-center">
        <b-col xl="8" lg="8" md="8" sm="12" cols="12">
          <h3 v-if="appointments.length === 0 && (usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0)">Este utilizador não tem consultas associadas.</h3>
          <h3 v-if="appointments.length === 0 && (usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0)">Carregue <router-link :to="{ name: 'formAppoint' }">aqui</router-link> para adicionar uma nova consulta.</h3>
          <h3 v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">Não foi selecionado nenhum utilizador.</h3>
          <h3 v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">Carregue <router-link :to="{ name: 'calendar' }">aqui</router-link> para escolher um.</h3>
          <b-card
            v-if="(usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0) && appointments.length !== 0"
            v-for="appt in appointments"
            :key="appt.appointmentPK"
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
            <b-button v-if="['COR', 'PRF', 'MED'].includes(userAuth.type)" variant="danger" @click="remove(appt)">Eliminar</b-button>
            <b-button v-if="['COR', 'PRF', 'MED'].includes(userAuth.type)" @click="edit(appt.appointmentPK)">Editar</b-button>
            <b-button @click="viewNotes(appt.appointmentPK)">Notas de consulta</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'listAppoints',
  components: {
  },
  props: {
  },
  data: () => ({
    apptToRemove: null
  }),
  created () {
    if (this.usersActive.caregivers.length !== 0 || this.usersActive.patients.length !== 0) {
      this.$store.dispatch('events/getEvents', this.usersActive)
    }
  },
  computed: {
    ...mapState({
      appointments: state => state.appointments.appointments,
      usersActive: state => state.users.usersActive,
      apptPK: state => state.notes.apptPK,
      userAuth: state => state.users.userAuth
    }),
    ...mapGetters('appointments', [
      'getAppointmentsById'
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
    }
  },
  methods: {
    ...mapActions('appointments', ['deleteAppointment']),
    ...mapActions('notes', ['setApptPK']),
    edit (apptPK) {
      this.$emit(
        'editAppointment',
        this.getAppointmentsById(apptPK)
      )
    },
    remove (appt) {
      this.apptToRemove = appt
      this.showModal()
    },
    showModal () {
      this.$refs['my-modal'].show()
    },
    confirme (bool) {
      if (bool === true) {
        this.deleteAppointment(this.apptToRemove)
          .then(() => {
            this.$notify({
              title: 'A consulta foi eliminada com sucesso.',
              duration: 3000,
              group: 'success'
            })
            this.apptToRemove = null
            this.$refs['my-modal'].hide()
          })
          .catch(() => {
            this.$notify({
              title: 'Ocorreu um erro ao eliminar a consulta.',
              duration: 3000,
              group: 'error'
            })
          })
      } else {
        this.apptToRemove = null
        this.$refs['my-modal'].hide()
      }
    },
    viewNotes (apptPK) {
      this.setApptPK(apptPK)
      this.$router.push({ name: 'notes' })
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
