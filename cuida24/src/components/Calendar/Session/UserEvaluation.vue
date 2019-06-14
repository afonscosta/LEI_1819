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

    <h3 v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">
      Não foi selecionado nenhum utilizador.
    </h3>

    <h3 v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">
      Carregue <router-link :to="{ name: 'calendar' }">aqui</router-link> para escolher um.
    </h3>
    
    <b-modal 
      ref="modal-del-caregiver"
      hide-footer title="Eliminação de uma avaliação"
    >
      <div class="d-block text-center">
        <h3>Tem a certeza que pretende eliminar a avaliação do cuidador?</h3>
      </div>
      <b-button class="mt-2" variant="success" block @click="confirme('caregiver', false)">Não</b-button>
      <b-button class="mt-3" variant="danger" block @click="confirme('caregiver', true)">Sim</b-button>
    </b-modal>
    <b-modal 
      ref="modal-del-patient"
      hide-footer title="Eliminação de uma avaliação"
    >
      <div class="d-block text-center">
        <h3>Tem a certeza que pretende eliminar a avaliação do utente?</h3>
      </div>
      <b-button class="mt-2" variant="success" block @click="confirme('patient', false)">Não</b-button>
      <b-button class="mt-3" variant="danger" block @click="confirme('patient', true)">Sim</b-button>
    </b-modal>

    <b-modal 
      ref="modal-comment-caregiver"
      hide-footer :title="'Avaliação relativa a ' + getCaregiverName(selectedCaregiver)"
      centered
    >
      <b-form @submit.prevent="onSubmitCaregiver">
        <b-form-textarea
          id="textarea"
          v-model="comment"
          placeholder="Insira uma avaliação..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
        <b-button v-if="!selectedEvaluation" class="mt-2" block type="submit" variant="primary">Submeter</b-button>
        <b-button v-if="selectedEvaluation" class="mt-2" block type="submit" variant="primary">Atualizar</b-button>
      </b-form>
      <b-button class="mt-2" block @click="$refs['modal-comment-caregiver'].hide()">Cancelar</b-button>
    </b-modal>

    <b-modal 
      ref="modal-comment-patient"
      hide-footer :title="'Avaliação relativa a ' + getPatientName(selectedPatient)"
      centered
    >
      <b-form @submit.prevent="onSubmitPatient">
        <b-form-textarea
          id="textarea"
          v-model="comment"
          placeholder="Insira uma avaliação..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
        <b-button v-if="!selectedEvaluation" class="mt-2" block type="submit" variant="primary">Submeter</b-button>
        <b-button v-if="selectedEvaluation" class="mt-2" block type="submit" variant="primary">Atualizar</b-button>
      </b-form>
      <b-button class="mt-2" block @click="$refs['modal-comment-patient'].hide()">Cancelar</b-button>
    </b-modal>

    <b-container v-if="usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0">
      <b-row>
        <b-col md="6" cols="12">
          <h3 v-if="caregivers.length === 0">
            Não existem cuidadores atribuídos à sessão selecionada.
          </h3>
          <b-table
            v-if="caregivers.length > 0"
            :items="caregivers"
            :fields="fields"
            :tbody-tr-class="evaluationDoneCaregiver"
          >
            <template slot="show_details" slot-scope="row">
              <b-button v-if="!hasCaregiverComment(row)" size="sm" @click="evaluateCaregiver(row)" class="mr-2">
                Avaliar
              </b-button>
              <b-button-group vertical>
                <b-button v-if="hasCaregiverComment(row)" size="sm" @click="seeCaregiverEvaluation(row)" class="mr-2">
                  Consultar avaliação
                </b-button>
                <b-button v-if="hasCaregiverComment(row)" size="sm" @click="removeCaregiverEvaluation(row)" class="mr-2" variant="danger">
                  Eliminar avaliação
                </b-button>
              </b-button-group>
            </template>
          </b-table>
        </b-col>
        <b-col md="6" cols="12">
          <h3 v-if="patients.length === 0">
            Não existem utentes atribuídos à sessão selecionada.
          </h3>
          <b-table
            v-if="patients.length > 0"
            :items="patients"
            :fields="fields"
            :tbody-tr-class="evaluationDonePatient"
          >
            <template slot="show_details" slot-scope="row">
              <b-button size="sm" v-if="!hasPatientComment(row)" @click="evaluatePatient(row)" class="mr-2">
                Avaliar
              </b-button>
              <b-button-group vertical>
                <b-button v-if="hasPatientComment(row)" size="sm" @click="seePatientEvaluation(row)" class="mr-2">
                  Consultar avaliação
                </b-button>
                <b-button v-if="hasPatientComment(row)" size="sm" @click="removePatientEvaluation(row)" class="mr-2" variant="danger">
                  Eliminar avaliação
                </b-button>
              </b-button-group>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-container>
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
    selectedPatient: null,
    selectedEvaluation: null
  }),
  created () {
    if (this.usersActive.caregivers.length !== 0 || this.usersActive.patients.length !== 0) {
      this.caregivers = this.getCaregiversInfo
      this.patients = this.getPatientsInfo
      this.$store.dispatch('evaluations/getEvaluations', this.session.groupSession ? this.session.groupSession.pk : this.session.individualSession.pk)
    }
  },
  computed: {
    ...mapState({
      usersActive: state => state.users.usersActive,
      session: state => state.evaluations.session,
      caregiversEvaluations: state => state.evaluations.caregiversEvaluations,
      patientsEvaluations: state => state.evaluations.patientsEvaluations
    }),
    ...mapGetters('evaluations', ['getCaregiversInfo', 'getPatientsInfo'])
  },
  methods: {
    ...mapActions('evaluations', [
      'addCaregiverEvaluation', 'updateCaregiverEvaluation', 'deleteCaregiverEvaluation',
      'addPatientEvaluation', 'updatePatientEvaluation', 'deletePatientEvaluation'
    ]),
    evaluateCaregiver (row) {
      this.selectedCaregiver = row.item
      console.log('XXXXXXX', row.item)
      this.$refs['modal-comment-caregiver'].show()
    },
    evaluatePatient (row) {
      this.selectedPatient = row.item
      this.$refs['modal-comment-patient'].show()
    },
    onSubmitCaregiver () {
      if (this.selectedEvaluation) {
        this.selectedEvaluation.comment = this.comment
        this.updateCaregiverEvaluation(this.selectedEvaluation)
          .then(() => {
            console.log('entrou no then')
            this.$notify({
              title: 'A avaliação foi atualizada com sucesso.',
              duration: 3000,
              group: 'success'
            })
            this.$refs['modal-comment-caregiver'].hide()
            this.selectedCaregiver = null
            this.selectedEvaluation = null
            this.comment = ''
          })
          .catch(() => {
            console.log('entrou no catch')
            this.$notify({
              title: 'Ocorreu um erro ao atualizar a avaliação.',
              duration: 3000,
              group: 'error'
            })
          })
      } else {
        const payload = {
          'comment': this.comment,
          'sessionPK': this.session.groupSession ? this.session.groupSession.pk : this.session.individualSession.pk,
          'caregiverPK': this.selectedCaregiver.pk
        }
        this.addCaregiverEvaluation(payload)
          .then(() => {
            this.$notify({
              title: 'A avaliação foi adicionada com sucesso.',
              duration: 3000,
              group: 'success'
            })
            this.$refs['modal-comment-caregiver'].hide()
            this.selectedCaregiver = null
            this.selectedEvaluation = null
            this.comment = ''
          })
          .catch(() => {
            this.$notify({
              title: 'Ocorreu um erro ao adicionar a avaliação.',
              duration: 3000,
              group: 'error'
            })
          })
      }
    },
    onSubmitPatient () {
      if (this.selectedEvaluation) {
        this.selectedEvaluation.comment = this.comment
        this.updatePatientEvaluation(this.selectedEvaluation)
          .then(() => {
            this.$notify({
              title: 'A avaliação foi atualizada com sucesso.',
              duration: 3000,
              group: 'success'
            })
            this.$refs['modal-comment-patient'].hide()
            this.selectedPatient = null
            this.selectedEvaluation = null
            this.comment = ''
          })
          .catch(() => {
            this.$notify({
              title: 'Ocorreu um erro ao atualizar a avaliação.',
              duration: 3000,
              group: 'error'
            })
          })
      } else {
        const payload = {
          'comment': this.comment,
          'sessionPK': this.session.groupSession ? this.session.groupSession.pk : this.session.individualSession.pk,
          'patientPK': this.selectedPatient.pk
        }
        this.addPatientEvaluation(payload)
          .then(() => {
            this.$notify({
              title: 'A avaliação foi adicionada com sucesso.',
              duration: 3000,
              group: 'success'
            })
            this.$refs['modal-comment-patient'].hide()
            this.selectedPatient = null
            this.selectedEvaluation = null
            this.comment = ''
          })
          .catch(() => {
            this.$notify({
              title: 'Ocorreu um erro ao adicionar a avaliação.',
              duration: 3000,
              group: 'error'
            })
          })
      }
    },
    evaluationDoneCaregiver (caregiver, type) {
      if (!caregiver) return
      if (this.caregiversEvaluations.find(e => e.caregiverPK === caregiver.pk)) return 'table-success'
    },
    evaluationDonePatient (patient, type) {
      if (!patient) return
      if (this.patientsEvaluations.find(e => e.patientPK === patient.pk)) return 'table-success'
    },
    hasCaregiverComment (row) {
      const es = this.caregiversEvaluations.find(e => e.caregiverPK === row.item.pk)
      if (es) {
        return true
      }
      return false
    },
    hasPatientComment (row) {
      const es = this.patientsEvaluations.find(e => e.patientPK === row.item.pk)
      if (es) {
        return true
      }
      return false
    },
    seeCaregiverEvaluation (row) {
      this.selectedCaregiver = row.item
      console.log('XXXXXXX', row.item)
      this.selectedEvaluation = this.caregiversEvaluations.find(e => e.caregiverPK === row.item.pk)
      this.comment = this.selectedEvaluation.comment
      this.$refs['modal-comment-caregiver'].show()
    },
    seePatientEvaluation (row) {
      this.selectedPatient = row.item
      this.selectedEvaluation = this.patientsEvaluations.find(e => e.patientPK === row.item.pk)
      this.comment = this.selectedEvaluation.comment
      this.$refs['modal-comment-patient'].show()
    },
    removeCaregiverEvaluation (row) {
      this.selectedEvaluation = this.caregiversEvaluations.find(e => e.caregiverPK === row.item.pk)
      this.$refs['modal-del-caregiver'].show()
    },
    removePatientEvaluation (row) {
      this.selectedEvaluation = this.patientsEvaluations.find(e => e.patientPK === row.item.pk)
      this.$refs['modal-del-patient'].show()
    },
    confirme (type, bool) {
      if (type === 'caregiver') {
        if (bool === true) {
          this.deleteCaregiverEvaluation(this.selectedEvaluation.pk)
            .then(() => {
              this.$notify({
                title: 'A avaliação foi removida com sucesso.',
                duration: 3000,
                group: 'success'
              })
              this.$refs['modal-del-caregiver'].hide()
              this.selectedEvaluation = null
              this.comment = ''
            })
            .catch(() => {
              this.$notify({
                title: 'Ocorreu um erro ao remover a avaliação.',
                duration: 3000,
                group: 'error'
              })
            })
        } else {
          this.$refs['modal-del-caregiver'].hide()
          this.selectedEvaluation = null
          this.comment = ''
        }
      } else if (type === 'patient') {
        if (bool === true) {
          this.deletePatientEvaluation(this.selectedEvaluation.pk)
            .then(() => {
              this.$notify({
                title: 'A avaliação foi removida com sucesso.',
                duration: 3000,
                group: 'success'
              })
              this.$refs['modal-del-patient'].hide()
              this.selectedEvaluation = null
              this.comment = ''
            })
            .catch(() => {
              this.$notify({
                title: 'Ocorreu um erro ao remover a avaliação.',
                duration: 3000,
                group: 'error'
              })
            })
        } else {
          this.$refs['modal-del-patient'].hide()
          this.selectedEvaluation = null
          this.comment = ''
        }
      }
    },
    getCaregiverName (caregiver) {
      if (caregiver) {
        return caregiver.info.name
      }
      return ''
    },
    getPatientName (patient) {
      if (patient) {
        return patient.info.name
      }
      return ''
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
