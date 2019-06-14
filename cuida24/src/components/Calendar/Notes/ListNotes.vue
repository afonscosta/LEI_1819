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

    <div>
      <b-modal 
        ref="my-modal"
        hide-footer title="Eliminação de nota"
      >
        <div class="d-block text-center">
          <h3>Tem a certeza que pretende eliminar a nota de consulta?</h3>
        </div>
        <b-button class="mt-2" variant="success" block @click="confirme(false)">Não</b-button>
        <b-button class="mt-3" variant="danger" block @click="confirme(true)">Sim</b-button>
      </b-modal>
    </div>

    <h3 v-if="notes.length === 0">Esta consulta não tem notas associadas.</h3>

    <div role="tablist" v-if="notes.length !== 0">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle.accordion-1>Notas de Enfermagem</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" role="tabpanel">
          <b-card-body>
            <b-card
              v-for="note in notesEnf"
              :key="note.pk"
              border-variant="dark"
              header="Nota de consulta"
            >
              <FormNote v-if="editingNote == note.pk" :noteData="note" @disableEditingNote="editingNote = null"></FormNote>
              <div v-if="editingNote != note.pk">
                <b-card-text align="left">{{ note.note }}</b-card-text>
                <b-button variant="danger" @click="remove(note.pk)">Eliminar</b-button>
                <b-button @click="edit(note.pk)">Editar</b-button>
              </div>
            </b-card>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle.accordion-2>Notas Clínicas</b-button>
        </b-card-header>
        <b-collapse id="accordion-2" role="tabpanel">
          <b-card-body>
            <b-card
              v-for="note in notesCli"
              :key="note.pk"
              border-variant="dark"
              header="Nota de consulta"
            >
              <FormNote v-if="editingNote == note.pk" :noteData="note" @disableEditingNote="editingNote = null"></FormNote>
              <div v-if="editingNote != note.pk">
                <b-card-text align="left">{{ note.note }}</b-card-text>
                <b-button variant="danger" @click="remove(note.pk)">Eliminar</b-button>
                <b-button @click="edit(note.pk)">Editar</b-button>
              </div>
            </b-card>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle.accordion-3>Notas Psicólogo</b-button>
        </b-card-header>
        <b-collapse id="accordion-3" role="tabpanel">
          <b-card-body>
            <b-card
              v-for="note in notesPsi"
              :key="note.pk"
              border-variant="dark"
              header="Nota de consulta"
            >
              <FormNote v-if="editingNote == note.pk" :noteData="note" @disableEditingNote="editingNote = null"></FormNote>
              <div v-if="editingNote != note.pk">
                <b-card-text align="left">{{ note.note }}</b-card-text>
                <b-button variant="danger" @click="remove(note.pk)">Eliminar</b-button>
                <b-button @click="edit(note.pk)">Editar</b-button>
              </div>
            </b-card>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle.accordion-4>Outras Apreciações</b-button>
        </b-card-header>
        <b-collapse id="accordion-4" role="tabpanel">
          <b-card-body>
            <b-card
              v-for="note in notesOut"
              :key="note.pk"
              border-variant="dark"
              header="Nota de consulta"
            >
              <FormNote v-if="editingNote == note.pk" :noteData="note" @disableEditingNote="editingNote = null"></FormNote>
              <div v-if="editingNote != note.pk">
                <b-card-text align="left">{{ note.note }}</b-card-text>
                <b-button variant="danger" @click="remove(note.pk)">Eliminar</b-button>
                <b-button @click="edit(note.pk)">Editar</b-button>
              </div>
            </b-card>
          </b-card-body>
        </b-collapse>
      </b-card>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import FormNote from '@/components/Calendar/Notes/FormNote'

export default {
  name: 'listNotes',
  components: {
    FormNote
  },
  props: {
  },
  data: () => ({
    noteToRemove: null,
    editingNote: null
  }),
  created () {
    this.$store.dispatch('notes/getNotes', this.apptPK)
  },
  computed: {
    ...mapState({
      notes: state => state.notes.notes,
      apptPK: state => state.notes.apptPK
    }),
    ...mapGetters('notes', [
      'notesEnf',
      'notesCli',
      'notesPsi',
      'notesOut'
    ])
  },
  methods: {
    ...mapActions('notes', ['updateNote', 'deleteNote']),
    edit (notePK) {
      this.editingNote = notePK
    },
    remove (notePK) {
      this.noteToRemove = notePK
      this.showModal()
    },
    showModal () {
      this.$refs['my-modal'].show()
    },
    confirme (bool) {
      if (bool === true) {
        this.deleteNote(this.noteToRemove)
          .then(() => {
            this.$notify({
              title: 'A nota de consulta foi eliminada com sucesso.',
              duration: 3000,
              group: 'success'
            })
            this.noteToRemove = null
            this.$refs['my-modal'].hide()
          })
          .catch(() => {
            this.$notify({
              title: 'Ocorreu um erro ao eliminar a nota de consulta.',
              duration: 3000,
              group: 'error'
            })
          })
      } else {
        this.noteToRemove = null
        this.$refs['my-modal'].hide()
      }
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
