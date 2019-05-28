<template>
  <div>
    <div>
      <b-modal 
        ref="my-modal"
        hide-footer title="Eliminação de consulta"
      >
        <div class="d-block text-center">
          <h3>Tem a certeza que pretende eliminar a prescrição?</h3>
        </div>
        <b-button class="mt-3" variant="danger" block @click="confirme(true)">Sim</b-button>
        <b-button class="mt-2" variant="success" block @click="confirme(false)">Não</b-button>
      </b-modal>
    </div>
    <b-container>
      <b-row class="justify-content-md-center">
        <b-col xl="8" lg="8" md="8" sm="12" cols="12">
          <h3 v-if="prescriptions.length === 0 && (usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0)">Este utilizador não tem prescrições associadas.</h3>
          <h3 v-if="prescriptions.length === 0 && (usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0)">Carregue <router-link :to="{ name: 'formPrescription' }">aqui</router-link> para adicionar uma nova prescrição.</h3>
          <h3 v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">Não foi selecionado nenhum utilizador.</h3>
          <h3 v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">Carregue <router-link :to="{ name: 'medication' }">aqui</router-link> para escolher um.</h3>
          <b-card
            v-if="(usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0) && prescriptions.length !== 0"
            v-for="presc in prescriptions"
            :key="presc.prescription.pk"
            border-variant="dark"
            :header="presc.event.data.title"
          >
            <b-card-text align="left">
              <b>Medicamento:</b> {{ getMedicineById(presc.prescription.medicine).activeSubs }}
            </b-card-text>

            <b-card-text align="left">
              <b>Quantidade:</b> {{ presc.prescription.quantity }} ml/mg
            </b-card-text>

            <b-card-text align="left">
              <b>Via de administração:</b> {{ presc.event.data.description }}
            </b-card-text>

            <b-card-text align="left">
              <b>Data da primeira toma:</b> {{ presc.occurrenceDate.dayOfMonth + '/' + presc.occurrenceDate.month + '/' + presc.occurrenceDate.year }}
            </b-card-text>

            <b-card-text align="left">
              <b>Repetição:</b> {{ parseScheduleRepetition(presc) }}
            </b-card-text>

            <b-card-text v-if="presc.event.schedule.times" align="left">
              <b>Hora:</b> {{ presc.event.schedule.times[0] }}
            </b-card-text>

            <b-card-text align="left">
              <b>Utente:</b> {{ getPatientById(presc.users.patients[0]).info.name }}
            </b-card-text>

            <b-card-text align="left">
              <b>Prescrição realizada por:</b> {{ getBackofficeUserById(presc.prescription.author) }}
            </b-card-text>
            
            <b-card-text align="left">
              <b>Data de prescrição:</b> {{ presc.prescription.date }}
            </b-card-text>

            <b-button variant="danger" @click="remove(presc)">Eliminar</b-button>
            <b-button @click="$emit('editPrescription', presc)">Editar</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  name: 'ListPrescription',
  components: {
  },
  props: {
  },
  data: () => ({
    prescToRemove: null
  }),
  created () {
    if (this.usersActive.caregivers.length !== 0 || this.usersActive.patients.length !== 0) {
      this.$store.dispatch('prescriptions/getPrescriptions', this.usersActive)
      this.$store.dispatch('medicines/getMedicines')
      this.$store.dispatch('users/getBackoffice')
    }
  },
  computed: {
    ...mapState({
      prescriptions: state => state.prescriptions.prescriptions,
      usersActive: state => state.users.usersActive
    }),
    ...mapGetters('medicines', ['getMedicineById']),
    ...mapGetters('users', ['getPatientById', 'getBackofficeUserById']),
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
    ...mapActions('prescriptions', ['deletePrescription']),
    remove (presc) {
      this.prescToRemove = presc
      this.showModal()
    },
    showModal () {
      this.$refs['my-modal'].show()
    },
    confirme (bool) {
      if (bool === true) {
        this.deletePrescription(this.prescToRemove)
      }
      this.prescToRemove = null
      this.$refs['my-modal'].hide()
    },
    parseScheduleRepetition (presc) {
      var rec = null
      if (presc.event.schedule.duration &&
      presc.event.schedule.durationInDays &&
      presc.event.schedule.durationUnit &&
      !presc.event.schedule.times &&
      !presc.event.schedule.dayOfWeek &&
      !presc.event.schedule.dayOfMonth &&
      !presc.event.schedule.month &&
      !presc.event.schedule.year) {
        rec = 'diariamente'
      } else if (!presc.event.schedule.duration &&
      !presc.event.schedule.durationInDays &&
      !presc.event.schedule.durationUnit &&
      !presc.event.schedule.times &&
      presc.event.schedule.dayOfWeek &&
      !presc.event.schedule.dayOfMonth &&
      !presc.event.schedule.month &&
      !presc.event.schedule.year) {
        rec = 'semanalmente'
      } else if (!presc.event.schedule.duration &&
      !presc.event.schedule.durationInDays &&
      !presc.event.schedule.durationUnit &&
      !presc.event.schedule.times &&
      !presc.event.schedule.dayOfWeek &&
      presc.event.schedule.dayOfMonth &&
      !presc.event.schedule.month &&
      !presc.event.schedule.year) {
        rec = 'mensalmente'
      } else if (!presc.event.schedule.duration &&
      !presc.event.schedule.durationInDays &&
      !presc.event.schedule.durationUnit &&
      !presc.event.schedule.times &&
      !presc.event.schedule.dayOfWeek &&
      presc.event.schedule.dayOfMonth &&
      presc.event.schedule.month &&
      !presc.event.schedule.year) {
        rec = 'anualmente'
      }
      return rec
    }
  }
}
</script>
