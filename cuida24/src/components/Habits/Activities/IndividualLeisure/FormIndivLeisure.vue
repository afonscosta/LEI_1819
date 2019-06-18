<template>
  <div>
    <b-row>
      <b-col>
        <h3>Lazer individual</h3>
      </b-col>
    </b-row>
    <b-card>
      <b-form @submit="onSubmit" @reset="onReset">
        <b-row>
          <b-col align="left">
            <label for="input-description-indivLei">Descrição:</label>
            <b-form-input
              id="input-description-indivLei"
              v-model="description"
              placeholder="Insira uma descrição"
              required
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col>
            <b-button type="reset" variant="danger">Limpar</b-button>
            <b-button type="submit" variant="primary">Adicionar</b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'FormIndivLeisure',
  data: () => ({
    description: ''
  }),
  methods: {
    ...mapActions('habits', ['addIndivLeisure']),
    onSubmit () {
      this.addIndivLeisure({ description: this.description })
        .then(() => {
          this.$notify({
            title: 'O lazer Individual foi adicionado com sucesso.',
            duration: 3000,
            group: 'success'
          })
          this.onReset()
        })
        .catch(() => {
          this.$notify({
            title: 'Ocorreu um erro ao adicionar o lazer individual.',
            duration: 3000,
            group: 'error'
          })
        })
    },
    onReset () {
      this.description = ''
    }
  }
}
</script>
