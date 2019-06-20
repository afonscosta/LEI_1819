<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card bg-variant="light">
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group
              label-cols-lg="2"
              label="Novo funcionário"
              label-size="lg"
              label-class="font-weight-bold pt-0"
              class="mb-0"
            >
              <b-form-group label="Tipo de utilizador">
                <b-form-radio-group
                  v-model="selectedUserType"
                  :options="optionsUser"
                  name="radio-inline"
                  required
                ></b-form-radio-group>
              </b-form-group>

              <b-form-group
                v-if="selectedUserType === 'backoffice'"
                label-cols-sm="2"
                label="Função:"
                label-align-sm="right"
                label-for="nested-backoffice-type"
              >
                <b-form-select 
                  id="nested-backoffice-type"
                  v-model="selectedBackofficeType"
                  :options="optionsBackoffice">
                </b-form-select>
              </b-form-group>

              <b-form-group
                v-if="selectedUserType === 'patient'"
                label-cols-sm="2"
                label="Cuidador:"
                label-align-sm="right"
                label-for="nested-caregiver"
              >
                <b-form-select 
                  id="nested-caregiver"
                  v-model="selectedCaregiver"
                  :options="caregiversParsed">
                </b-form-select>
              </b-form-group>

              <b-form-group
                label-cols-sm="2"
                label="Primeiro nome:"
                label-align-sm="right"
                label-for="nested-first-name"
              >
                <b-form-input
                  id="nested-first-name"
                  required
                  v-model="info.first_name"></b-form-input>
              </b-form-group>
              <b-form-group
                label-cols-sm="2"
                label="Último nome:"
                label-align-sm="right"
                label-for="nested-last-name"
              >
                <b-form-input id="nested-last-name" 
                  required
                  v-model="info.last_name"></b-form-input>
              </b-form-group>
              <b-form-group
                label-cols-sm="2"
                label="Email:"
                label-align-sm="right"
                label-for="nested-email"
              >
                <b-form-input 
                  id="nested-email" 
                  required
                  type="email" 
                  v-model="info.email"></b-form-input>
              </b-form-group>
              <b-form-group
                label-cols-sm="2"
                label="Palavra-passe:"
                label-align-sm="right"
                label-for="nested-password"
              >
                <b-form-input id="nested-password" 
                  required
                  type="password" v-model="info.password"></b-form-input>
              </b-form-group>

              <div class="buttons float-right">
                <b-button type="submit" variant="primary">Registar</b-button>
              <b-button type="reset">Limpar</b-button>
              </div>
            </b-form-group>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3" v-if="caregivers.length > 0 && selectedUserType == 'caregiver'">
      <b-col>
        <b-card v-for="c in caregivers" :key="c.pk">
          <b-row>
            <b-col>
              <label>{{ c.info.name }}</label>
            </b-col>
            <b-col>
              <b-button @click="deleteCaregiver(c.pk)">Eliminar</b-button>
            </b-col>
            <b-col>
              <b-button>Editar</b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3" v-if="patients.length > 0 && selectedUserType == 'patient'">
      <b-col>
        <b-card v-for="p in patients" :key="p.pk">
          <b-row>
            <b-col>
              <label>{{ p.info.name }} (Cuidador: {{ p.caregiver }})</label>
            </b-col>
            <b-col>
              <b-button @click="deletePatient(p.pk)">Eliminar</b-button>
            </b-col>
            <b-col>
              <b-button>Editar</b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3" v-if="backoffice.length > 0 && selectedUserType == 'backoffice'">
      <b-col>
        <b-card v-for="b in backoffice" :key="b.pk">
          <b-row>
            <b-col>
              <label>{{ b.info.name }} ({{ b.type }})</label>
            </b-col>
            <b-col>
              <b-button @click="deleteBackoffice(b.pk)">Eliminar</b-button>
            </b-col>
            <b-col>
              <b-button>Editar</b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AddUsers',
  data: () => ({
    info: {
      first_name: '',
      last_name: '',
      password: '',
      email: ''
    },
    selectedUserType: '',
    selectedBackofficeType: '',
    selectedCaregiver: '',
    optionsUser: [
      { text: 'Paciente', value: 'patient' },
      { text: 'Cuidador', value: 'caregiver' },
      { text: 'Backoffice', value: 'backoffice' }
    ],
    optionsBackoffice: [
      { value: 'COR', text: 'Coordenador' },
      { value: 'REM', text: 'Responsável Medicação' },
      { value: 'PRF', text: 'Profissional Saúde' },
      { value: 'MED', text: 'Médico' },
      { value: 'ENF', text: 'Enfermeiro' },
      { value: 'PSI', text: 'Psicólogo' }
    ],
    show: true
  }),
  created () {
    this.getCaregivers()
    this.getPatients()
    this.getBackoffice()
  },
  computed: {
    ...mapState({
      caregivers: state => state.register.caregivers,
      patients: state => state.register.patients,
      backoffice: state => state.register.backoffice
    }),
    caregiversParsed () {
      return this.caregivers.map((c) => {
        return { value: c.pk, text: c.info.name }
      })
    }
  },
  methods: {
    ...mapActions('register', [
      'addCaregiver', 'addPatient', 'addBackoffice',
      'deleteCaregiver', 'deletePatient', 'deleteBackoffice',
      'getCaregivers', 'getPatients', 'getBackoffice'
    ]),
    onSubmit (evt) {
      // cancela o comportamento default do evento
      evt.preventDefault()
      // alert(JSON.stringify(this.form))
      this.info.username = this.info.email
      switch (this.selectedUserType) {
        case 'caregiver':
          this.addCaregiver({
            info: this.info
          })
          break
        case 'patient':
          this.addPatient({
            caregiver: this.selectedCaregiver,
            info: this.info
          })
          break
        case 'backoffice':
          this.addBackoffice({
            type: this.selectedBackofficeType,
            info: this.info
          })
          break
      }
      this.info = {
        first_name: '',
        last_name: '',
        password: '',
        email: ''
      }
      this.selectedUserType = ''
      this.selectedBackofficeType = ''
    },
    onReset (evt) {
      evt.preventDefault()
      // Reset our form values
      this.first_name = ''
      this.last_name = ''
      this.selected_user_type = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>

<style scoped>  
</style>


