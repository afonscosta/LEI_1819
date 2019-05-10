<template>
  <div>
    <b-table
      selectable
      select-mode="multi"
      selectedVariant="success"
      :items="users"
      :fields="fields"
      @row-selected="rowSelected"
    ></b-table>
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
      }
    },
    data: () => ({
      allSelected: false,
      selected: [],
      fields: {
        'info.name': {
          'label': 'Nome'
        }
      }
    }),
    watch: {
      selected: function (checked) {
        this.$emit('updateSelected', checked)
      }
    },
    methods: {
      rowSelected (users) {
        this.selected = users
        this.$emit('updateSelected', users)
      }
    }
  }
</script>
