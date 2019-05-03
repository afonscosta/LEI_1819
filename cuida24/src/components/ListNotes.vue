<template>
  <div>
    <div>
      <b-modal 
        ref="my-modal"
        hide-footer title="Eliminação de nota"
      >
        <div class="d-block text-center">
          <h3>Tem a certeza que pretende eliminar a nota de consulta?</h3>
        </div>
        <b-button class="mt-3" variant="danger" block @click="confirme(true)">Sim</b-button>
        <b-button class="mt-2" variant="success" block @click="confirme(false)">Não</b-button>
      </b-modal>
    </div>
    <h3 v-if="notes.length === 0">Esta consulta não tem notas associadas.</h3>
    <!--<h3 v-if="appointments.length === 0">Carregue <router-link :to="{ name: 'formNote' }">aqui</router-link> para adicionar uma nova nota de consulta.</h3>-->
    <div role="tablist">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle.accordion-1 variant="info">Accordion 1</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body
            v-for="note in notes"
            :key="note.pk"
            border-variant="dark"
            header="Nota de consulta"
          >
            <b-card-text align="left">{{ note.note }}</b-card-text>
            <b-button variant="danger" @click="remove(note.pk)">Eliminar</b-button>
            <b-button @click="edit(note.pk)">Editar</b-button>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle.accordion-2 variant="info">Accordion 2</b-button>
        </b-card-header>
        <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>Texto</b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'listNotes',
  components: {
  },
  props: {
  },
  data: () => ({
    noteToRemove: null
  }),
  created () {
    this.$store.dispatch('notes/getNotes')
  },
  computed: {
    ...mapState({
      notes: state => state.notes.notes
    })
  },
  methods: {
    ...mapActions('notes', ['deleteNote']),
    log (info) {
      console.log(info)
    },
    edit (notePK) {
      console.log('editNote', notePK)
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
        console.log('deleting note with PK =', this.noteToRemove)
        this.deleteNote(this.noteToRemove)
      }
      this.noteToRemove = null
      this.$refs['my-modal'].hide()
    }
  }
}
</script>
