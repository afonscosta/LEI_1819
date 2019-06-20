<template>
  <div class="container">
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
            label-cols-sm="2"
            label="Primeiro nome:"
            label-align-sm="right"
            label-for="nested-first-name"
          >
            <b-form-input id="nested-first-name" v-model="info.first_name"></b-form-input>
          </b-form-group>
          <b-form-group
            label-cols-sm="2"
            label="Último nome:"
            label-align-sm="right"
            label-for="nested-last-name"
          >
            <b-form-input id="nested-last-name" v-model="info.last_name"></b-form-input>
          </b-form-group>
          <b-form-group
            label-cols-sm="2"
            label="Email:"
            label-align-sm="right"
            label-for="nested-email"
          >
            <b-form-input id="nested-email" type="email" v-model="info.email"></b-form-input>
          </b-form-group>
          <b-form-group
            label-cols-sm="2"
            label="Palavra-passe:"
            label-align-sm="right"
            label-for="nested-password"
          >
            <b-form-input id="nested-password" type="password" v-model="info.password"></b-form-input>
          </b-form-group>

          <div class="buttons float-right">
            <b-button type="submit" variant="primary">Registar</b-button>
          <b-button type="reset">Limpar</b-button>
          </div>
        </b-form-group>
      </b-form>
    </b-card>
</div>
</template>

<script>
import { mapActions } from 'vuex'

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
    optionsUser: [
      { text: 'Paciente', value: 'pacient' },
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
  methods: {
    ...mapActions('register', ['addCaregiver', 'addPatient', 'addBackoffice']),
    onSubmit (evt) {
      // cancela o comportamento default do evento
      evt.preventDefault()
      // alert(JSON.stringify(this.form))
      var payload = this.info
      switch (this.selectedUserType) {
        case 'caregiver':
          console.log(this.first_name)
          this.$store.dispatch('register/registerCaregiver', {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            username: this.email,
            password: this.password
          })
          break
        case 'pacient':
          alert('Opção ainda em desenvolvimento')
          // this.$store.dispatch('register/registerPatient', {
          //   first_name: this.first_name,
          //   last_name: this.last_name,
          //   email: this.email,
          //   username: this.email,
          //   password: this.password
          // })
          break
        case 'backoffice':
          this.addBackoffice({
            type: this.selectedBackofficeType,
            info: this.info
          })
          break
      }
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


