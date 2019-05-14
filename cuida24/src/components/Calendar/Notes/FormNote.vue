<template>
  <div>
    <b-form @submit.prevent="onSubmit">
      <b-form-textarea
        id="note"
        v-model="note.note"
        required
        rows="3"
        max-rows="6"
        placeholder="Insira as notas da consulta aqui"
      ></b-form-textarea>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'

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
      category: 'ENF'
    }
  }),
  created () {
    if (this.noteData) {
      this.note = this.noteData
    }
  },
  computed: {
    ...mapState({
      apptPK: state => state.notes.apptPK
    })
  },
  methods: {
    onSubmit (evt) {
      this.note.appointment = this.apptPK
      this.$emit('returnNote', this.note)
      this.note = {
        note: '',
        author: 1,
        appointment: null,
        category: 'ENF'
      }
    }
  }
}
</script>
