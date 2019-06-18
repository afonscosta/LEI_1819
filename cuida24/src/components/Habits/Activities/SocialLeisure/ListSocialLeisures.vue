<template>
  <div>
    <b-container>
      <p v-if="socialLeisures.length === 0">Não existem lazeres sociais registados</p>
      <b-card v-if="socialLeisures.length > 0" v-for="sl in socialLeisures" :key="sl.pk">
        <b-row align-v="center">
          <b-col align="left" align-self="center">
            <p><strong>Descrição:</strong> {{ sl.description }}</p>
          </b-col>
          <b-col align-self="center">
            <b-button variant="danger" @click="beforeDeleteSocialLeisure(sl.pk)">Eliminar</b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ListSocialLeisures',
  computed: {
    ...mapState({
      socialLeisures: state => state.habits.socialLeisures
    })
  },
  methods: {
    ...mapActions('habits', ['deleteSocialLeisure']),
    beforeDeleteSocialLeisure (pk) {
      this.deleteSocialLeisure(pk)
        .then(() => {
          this.$notify({
            title: 'O lazer social foi eliminado com sucesso.',
            duration: 3000,
            group: 'success'
          })
        })
        .catch(() => {
          this.$notify({
            title: 'Ocorreu um erro ao eliminar o lazer social.',
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
