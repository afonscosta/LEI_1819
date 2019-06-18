<template>
  <div>
    <b-container>
      <p v-if="indivLeisures.length === 0">Não existem lazeres individuais registados</p>
      <b-card v-if="indivLeisures.length > 0" v-for="il in indivLeisures" :key="il.pk">
        <b-row align-v="center">
          <b-col align="left" align-self="center">
            <p><strong>Descrição:</strong> {{ il.description }}</p>
          </b-col>
          <b-col align-self="center">
            <b-button variant="danger" @click="beforeDeleteIndivLeisure(il.pk)">Eliminar</b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ListIndivLeisures',
  computed: {
    ...mapState({
      indivLeisures: state => state.habits.indivLeisures
    })
  },
  methods: {
    ...mapActions('habits', ['deleteIndivLeisure']),
    beforeDeleteIndivLeisure (pk) {
      this.deleteIndivLeisure(pk)
        .then(() => {
          this.$notify({
            title: 'O lazer individual foi eliminado com sucesso.',
            duration: 3000,
            group: 'success'
          })
        })
        .catch(() => {
          this.$notify({
            title: 'Ocorreu um erro ao eliminar o lazer individual.',
            duration: 3000,
            group: 'error'
          })
        })
    }
  }
}
</script>

<style>
</style>
