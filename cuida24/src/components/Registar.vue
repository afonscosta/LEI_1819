<template>
  <div class="container">
    <b-card bg-variant="light">
      <!-- FALTA A RESTANTE INFORMAÇÃO PARA CADA TIPO DE UTILIZADOR A REGISTAR -->
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
              :options="options"
              name="radio-inline"
            ></b-form-radio-group>
          </b-form-group>
          <b-form-group
            label-cols-sm="2"
            label="Primeiro nome:"
            label-align-sm="right"
            label-for="nested-first-name"
          >
            <b-form-input id="nested-first-name" v-model="first_name"></b-form-input>
          </b-form-group>
          <b-form-group
            label-cols-sm="2"
            label="Último nome:"
            label-align-sm="right"
            label-for="nested-last-name"
          >
            <b-form-input id="nested-last-name" v-model="last_name"></b-form-input>
          </b-form-group>
          <b-form-group
            label-cols-sm="2"
            label="Email:"
            label-align-sm="right"
            label-for="nested-email"
          >
            <b-form-input id="nested-email" type="email" v-model="email"></b-form-input>
          </b-form-group>
          <b-form-group
            label-cols-sm="2"
            label="Palavra-passe:"
            label-align-sm="right"
            label-for="nested-password"
          >
            <b-form-input id="nested-password" type="password" v-model="password"></b-form-input>
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
  export default {
    name: 'registar',
    data () {
      return {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        selectedUserType: '',
        options: [
          { text: 'Paciente', value: 'pacient' },
          { text: 'Cuidador', value: 'caregiver' }
        ],
        show: true
      }
    },
    methods: {
      onSubmit (evt) {
        // cancela o comportamento default do evento
        evt.preventDefault()
        // alert(JSON.stringify(this.form))
        if (this.first_name === '' | this.last_name === '' | this.email === '' | this.password === '' | this.selectedUserType === '') {
          alert('Por favor preencha todos os campos do formulário.')
          console.log(this.password)
        } else {
          switch (this.selectedUserType) {
            case 'caregiver':
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
          }
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


