<template>
  <div>
    <b-container>
      <p v-if="physicalActivities.length === 0">Não existem atividades físicas registadas</p>
      <b-card v-if="physicalActivities.length > 0" v-for="pa in physicalActivities" :key="pa.pk">
        <b-row align-v="center">
          <b-col align="left" align-self="center">
            <p><strong>Descrição:</strong> {{ pa.description }}</p>
          </b-col>
          <b-col align-self="center">
            <b-button variant="danger" @click="beforeDeletePhysicalActivity(pa.pk)">Eliminar</b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ListPhysicalActivities',
  computed: {
    ...mapState({
      physicalActivities: state => state.habits.physicalActivities
    })
  },
  methods: {
    ...mapActions('habits', ['deletePhysicalActivity']),
    beforeDeletePhysicalActivity (pk) {
      this.deletePhysicalActivity(pk)
        .then(() => {
          this.$notify({
            title: 'A atividade física foi eliminada com sucesso.',
            duration: 3000,
            group: 'success'
          })
        })
        .catch(() => {
          this.$notify({
            title: 'Ocorreu um erro ao eliminar a atividade física.',
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
