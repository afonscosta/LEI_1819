<template>
  <b-container>
    <b-row class="justify-content-md-center">
      <b-col xl="8" lg="8" md="8" sm="12" cols="12">
        <FormNote :note="note" @addNote="addNote"></FormNote>
      </b-col>
    </b-row>
    <b-row class="justify-content-md-center">
      <b-col xl="8" lg="8" md="8" sm="12" cols="12">
        <ListNotes></ListNotes>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import FormNote from '@/components/FormNote'
import ListNotes from '@/components/ListNotes'
import { mapActions } from 'vuex'

export default {
  name: 'Notes',
  components: {
    FormNote,
    ListNotes
  },
  props: {
  },
  data: () => ({
    note: ''
  }),
  methods: {
    ...mapActions('notes', ['addNote'])
  }
}
</script>
