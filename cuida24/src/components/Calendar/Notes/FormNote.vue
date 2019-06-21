<template>
  <div>
    <h5>Adicionar nota de consulta</h5>
    <b-form @submit.prevent="onSubmit">
      <b-form-textarea
        id="note"
        v-model="note.note"
        required
        rows="3"
        max-rows="6"
        placeholder="Insira as notas da consulta aqui"
      ></b-form-textarea>

      <b-button class="mb-3" type="submit" variant="primary">Submeter</b-button>
    </b-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'formNote',
  components: {
  },
  props: {
    noteData: {
      default: null,
      type: Object
    }
  },
  data: () => ({
    note: {
      note: '',
      author: 1,
      appointment: null,
      category: 'ENF',
      pk: null
    }
  }),
  created () {
    if (this.noteData) {
      this.note = this.noteData
    } else {
      this.note.category = this.getCategoryFromAuthUser()
    }
    this.note.author = this.userAuth.pk
  },
  computed: {
    ...mapState({
      apptPK: state => state.notes.apptPK,
      userAuth: state => state.users.userAuth
    })
  },
  methods: {
    ...mapActions('notes', ['addNote', 'updateNote']),
    onSubmit (evt) {
      if (this.note.pk == null) {
        this.note.appointment = this.apptPK
        this.addNote(this.note)
          .then(() => {
            this.$notify({
              title: 'A nota de consulta foi adicionada com sucesso.',
              duration: 3000,
              group: 'success'
            })
            // TODO: derivar do user + corrigir no data em cima
            console.log('userAuth', this.userAuth)
            this.note = {
              note: '',
              author: this.userAuth.pk,
              appointment: null,
              category: this.getCategoryFromAuthUser(),
              pk: null
            }
          })
          .catch(() => {
            this.$notify({
              title: 'Ocorreu um erro ao adicionar a nota de consulta.',
              duration: 3000,
              group: 'error'
            })
          })
      } else {
        this.updateNote(this.note)
          .then(() => {
            this.$emit('disableEditingNote')
            this.$notify({
              title: 'A nota de consulta foi atualizada com sucesso.',
              duration: 3000,
              group: 'success'
            })
            // TODO: derivar do user + corrigir no data em cima
            this.note = {
              note: '',
              author: this.userAuth.pk,
              appointment: null,
              category: this.getCategoryFromAuthUser(),
              pk: null
            }
          })
          .catch(() => {
            this.$notify({
              title: 'Ocorreu um erro ao atualizar a nota de consulta.',
              duration: 3000,
              group: 'error'
            })
          })
      }
    },
    getCategoryFromAuthUser () {
      var category = ''
      if (this.userAuth.type === 'COR') {
        category = 'OTR'
      } else if (this.userAuth.type === 'PRF') {
        category = 'OTR'
      } else if (this.userAuth.type === 'MED') {
        category = 'CLI'
      } else if (this.userAuth.type === 'ENF') {
        category = 'ENF'
      } else if (this.userAuth.type === 'PSI') {
        category = 'PSI'
      }
      return category
    }
  }
}
</script>
