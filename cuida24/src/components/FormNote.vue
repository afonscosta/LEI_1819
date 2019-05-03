<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-textarea
        id="note"
        v-model="note"
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
export default {
  name: 'formNote',
  components: {
  },
  props: {
    note: {
      required: true,
      type: String
    }
  },
  methods: {
    onSubmit (evt) {
      console.log('adding note', this.note)
      this.$emit('addNote', this.note)
    }
  }
}
</script>
