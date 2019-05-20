<template>
  <div>
    <b-table
      :items="meds"
      :tbody-tr-class="rowClass"
      @row-clicked="rowClicked"
    ></b-table>
  </div>
</template>

<script>
  export default {
    name: 'ListMedicines',
    props: {
      meds: {
        required: true,
        type: Array
      },
      selected: {
        required: true,
        type: Array
      }
    },
    data: () => ({
    }),
    methods: {
      rowClicked (med) {
        if (this.selected.find(m => m.pk === med.pk)) {
          this.$emit('removeSelected')
        } else {
          this.$emit('updateSelected', med)
        }
      },
      rowClass (med, type) {
        if (!med) return
        if (this.selected.find(m => m.pk === med.pk)) return 'table-success'
      }
    }
  }
</script>
