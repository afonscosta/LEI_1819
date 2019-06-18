<template>
  <div>
    <b-row>
      <b-col>
        <h3>Atividade física</h3>
      </b-col>
    </b-row>
    <b-card>
      <b-form @submit="onSubmit" @reset="onReset">
        <b-row>
          <b-col align="left">
            <label for="input-description-phyAct">Descrição:</label>
            <b-form-input
              id="input-description-phyAct"
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
  name: 'FormPhysicalActivity',
  data: () => ({
    description: ''
  }),
  methods: {
    ...mapActions('habits', ['addPhysicalActivity']),
    onSubmit () {
      this.addPhysicalActivity({ description: this.description })
        .then(() => {
          this.$notify({
            title: 'A atividade física foi adicionada com sucesso.',
            duration: 3000,
            group: 'success'
          })
          this.onReset()
        })
        .catch(() => {
          this.$notify({
            title: 'Ocorreu um erro ao adicionar a atividade física.',
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
