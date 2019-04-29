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
              v-model="selected"
              :options="options"
              name="radio-inline"
            ></b-form-radio-group>
          </b-form-group>
          <b-form-group
            label-cols-sm="2"
            label="Nome:"
            label-align-sm="right"
            label-for="nested-name"
          >
            <b-form-input id="nested-name"></b-form-input>
          </b-form-group>
          <div class="buttons float-right">
            <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
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
        name: '',
        selected: '',
        options: [
          { text: 'Paciente', value: 'pacient' },
          { text: 'Cuidador', value: 'caregiver' }
        ],
        show: true
      }
    },
    methods: {
      onSubmit (evt) {
        evt.preventDefault()
        alert(JSON.stringify(this.form))
      },
      onReset (evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.name = ''
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
  div.form-registar {
    max-width: 80%;
    margin: auto;
  }

  
</style>


