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
            :key="presc.prescriptionPK"
            border-variant="dark"
            :header="presc.event.data.title"
          >
            <b-card-text align="left">
              <b>Especialidade:</b> {{ presc.event.data.description }}
            </b-card-text>
            <b-card-text align="left">
              <b>Data:</b> {{ presc.occurrenceDate.dayOfMonth + '/' + presc.occurrenceDate.month + '/' + presc.occurrenceDate.year }}
            </b-card-text>
            <b-card-text v-if="presc.event.schedule.times" align="left">
              <b>Hora:</b> {{ presc.event.schedule.times[0] }}
            </b-card-text>
            <b-card-text v-if="!presc.event.schedule.times" align="left">
              <b>Duração:</b> Todo o dia
            </b-card-text>
            <b-card-text v-if="presc.event.schedule.duration" align="left">
              <b>Duração:</b> {{ presc.event.schedule.duration + " " + durationUnitTranslated(presc.event.schedule.durationUnit) }}
            </b-card-text>
            <b-card-text align="left">
              <b>Localização:</b> {{ presc.event.data.location }}
            </b-card-text>
            <b-button variant="danger" @click="remove(presc)">Eliminar</b-button>
            <b-button @click="edit(presc.prescriptionPK)">Editar</b-button>
            <b-button @click="viewNotes(presc.prescriptionPK)">Notas de consulta</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

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
      this.$store.dispatch('events/getEvents', this.usersActive)
    }
  },
  computed: {
    ...mapState({
      prescriptions: state => state.prescriptions.prescriptions,
      usersActive: state => state.users.usersActive,
      prescPK: state => state.notes.prescPK
    }),
    ...mapGetters('prescriptions', [
      'getPrescriptionsById'
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
    ...mapActions('prescriptions', ['deletePrescription']),
    ...mapActions('notes', ['setApptPK']),
    edit (prescPK) {
      this.$emit(
        'editPrescription',
        this.getPrescriptionsById(prescPK)
      )
    },
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
    viewNotes (prescPK) {
      this.setApptPK(prescPK)
      this.$router.push({ name: 'notes' })
    }
  }
}
</script>
