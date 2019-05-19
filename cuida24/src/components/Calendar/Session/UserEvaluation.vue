<template>
  <div>
    <b-modal 
      ref="modal-comment-caregiver"
      hide-footer title="Avaliação do cuidador"
    >
      <b-form @submit.prevent="onSubmitCaregiver">
        <b-form-textarea
          id="textarea"
          v-model="comment"
          placeholder="Insira uma avaliação..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
        <b-button class="mt-2" block type="submit" variant="primary">Submit</b-button>
      </b-form>
      <b-button class="mt-2" block @click="$refs['modal-comment-caregiver'].hide()">Cancelar</b-button>
    </b-modal>

    <b-modal 
      ref="modal-comment-patient"
      hide-footer title="Avaliação do utente"
    >
      <b-form @submit.prevent="onSubmitPatient">
        <b-form-textarea
          id="textarea"
          v-model="comment"
          placeholder="Insira uma avaliação..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
        <b-button class="mt-2" block type="submit" variant="primary">Submit</b-button>
      </b-form>
      <b-button class="mt-2" block @click="$refs['modal-comment-patient'].hide()">Cancelar</b-button>
    </b-modal>

    <b-table
      :items="caregivers"
      :fields="fields"
      :tbody-tr-class="evaluationDoneCaregiver"
    >
      <template slot="show_details" slot-scope="row">
        <b-button size="sm" @click="evaluateCaregiver(row)" class="mr-2">
          Avaliar
        </b-button>
      </template>
    </b-table>
    <b-table
      :items="patients"
      :fields="fields"
      :tbody-tr-class="evaluationDonePatient"
    >
      <template slot="show_details" slot-scope="row">
        <b-button size="sm" @click="evaluatePatient(row)" class="mr-2">
          Avaliar
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'UserEvaluation',
  data: () => ({
    caregivers: [],
    patients: [],
    fields: {
      'info.name': {
        'label': 'Nome'
      },
      'show_details': {
        'label': 'Avaliação'
      }
    },
    comment: '',
    selectedCaregiver: null,
    selectedPatient: null
  }),
  created () {
    this.caregivers = this.getCaregiversInfo
    this.patients = this.getPatientsInfo
    // get evaluations
    this.$store.dispatch('evaluations/getEvaluations', this.session.groupSession ? this.session.groupSession.pk : this.session.individualSession.pk)
  },
  computed: {
    ...mapState({
      session: state => state.evaluations.session,
      evaluations: state => state.evaluations.evaluations
    }),
    ...mapGetters('evaluations', ['getCaregiversInfo', 'getPatientsInfo'])
  },
  methods: {
    ...mapActions('evaluations', ['getEvaluations', 'addEvaluation', 'updateEvaluation', 'deleteEvaluation']),
    evaluateCaregiver (row) {
      this.selectedCaregiver = row.item
      this.$refs['modal-comment-caregiver'].show()
    },
    evaluatePatient (row) {
      this.selectedPatient = row.item
      this.$refs['modal-comment-patient'].show()
    },
    onSubmitCaregiver () {
      const payload = {
        'comment': this.comment,
        'sessionPK': this.session.groupSession ? this.session.groupSession.pk : this.session.individualSession.pk,
        'caregiverPK': this.selectedCaregiver.pk
      }
      this.addEvaluation(payload)
    },
    onSubmitPatient () {
      const payload = {
        'comment': this.comment,
        'sessionPK': this.session.groupSession ? this.session.groupSession.pk : this.session.individualSession.pk,
        'patientPK': this.selectedPatient.pk
      }
      this.addEvaluation(payload)
    },
    evaluationDoneCaregiver (caregiver, type) {
      if (!caregiver) return
      if (this.evaluations.find(e => e.caregiverPK === caregiver.pk)) return 'table-success'
    },
    evaluationDonePatient (patient, type) {
      if (!patient) return
      if (this.evaluations.find(e => e.patientPK === patient.pk)) return 'table-success'
    }
  }
}
</script>
