<template>
  <div>
    <b-form-group>
      <template slot="label">
        <b>{{ listName }}:</b><br>
        <b-form-checkbox
          v-model="allSelected"
          @change="toggleAll"
        >
          {{ allSelected ? 'Limpar seleção' : 'Selecionar todos' }}
        </b-form-checkbox>
      </template>

      <b-form-checkbox-group
        id="users"
        :checked="selected"
        :options="users"
        name="users"
        stacked
        buttons
        button-variant="light"
        @change="updateSelected"
      ></b-form-checkbox-group>
    </b-form-group>
  </div>
</template>

<script>
  export default {
    name: 'listUsers',
    props: {
      listName: {
        required: true,
        type: String
      },
      users: {
        required: true,
        type: Array
      },
      selected: {
        type: Array,
        default: []
      }
    },
    data: () => ({
      allSelected: false
    }),
    methods: {
      toggleAll (checked) {
        this.$emit('toggleAll', checked)
      },
      updateSelected (checked) {
        this.$emit('updateSelected', checked)
      }
    }
  }
</script>
