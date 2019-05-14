<template>
  <div>
    <b-table
      :items="users"
      :fields="fields"
      :tbody-tr-class="rowClass"
      @row-clicked="rowClicked"
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
      },
      selected: {
        required: true,
        type: Array
      },
      readOnly: {
        required: true,
        type: Boolean
      }
    },
    data: () => ({
      allSelected: false,
      fields: {
        'info.name': {
          'label': 'Nome'
        }
      }
    }),
    methods: {
      rowClicked (user) {
        if (!this.readOnly) {
          if (this.selected.find(u => u.pk === user.pk)) {
            this.$emit('removeSelected', user.pk)
          } else {
            this.$emit('addSelected', user)
          }
        }
      },
      rowClass (user, type) {
        if (!user) return
        if (this.selected.find(u => u.info.pk === user.info.pk)) return 'table-success'
      }
    }
  }
</script>
