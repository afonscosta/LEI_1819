<template>
  <div>
    <notifications 
      position="top center"
      classes="notif-success"
      :speed="500"
      :width="450"
      animation-name="v-fade-top"
      group="success"
    />
    <notifications 
      position="top center"
      classes="notif-error"
      :speed="500"
      :width="450"
      animation-name="v-fade-top"
      group="error"
    />

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
      if (this.userAuth.type === 'Coordenador') {
        category = 'OTR'
      } else if (this.userAuth.type === 'Profissional Saúde') {
        category = 'OTR'
      } else if (this.userAuth.type === 'Médico') {
        category = 'CLI'
      } else if (this.userAuth.type === 'Enfermeiro') {
        category = 'ENF'
      } else if (this.userAuth.type === 'Psicólogo') {
        category = 'PSI'
      }
      return category
    }
  }
}
</script>

<style>
.notif-success {
  margin: 10px;
  margin-bottom: 0;
  border-radius: 3px;
  padding: 10px 20px;
  background: #E8F9F0;
  border: 2px solid #D0F2E1;
}

.notif-error {
  margin: 10px;
  margin-bottom: 0;
  border-radius: 3px;
  padding: 10px 20px;
  background: #F9E8E8;
  border: 2px solid #FCF2F2;
}

.notification-title {
  letter-spacing: 1px;
  font-size: 17px;
  text-align: center;
}

.v-fade-top-enter-active,
.v-fade-top-leave-active,
.v-fade-ltopmove {
  transition: all .5s;
}
.v-fade-top-enter,
.v-fade-top-leave-to {
  opacity: 0;
  transform: translateY(-500px) scale(0.2);
}

.vdatetime-input {
  width: 100%;
}
</style>
