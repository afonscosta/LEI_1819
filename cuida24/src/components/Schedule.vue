<template>
  <div>
  <b-form-select v-model="selected" :options="options"></b-form-select>
  <b-dropdown id="dropdown-1" text="Repetição">
    <b-dropdown-item 
      @click="throwEvent('none')"
    >
      Não se repete
    </b-dropdown-item>
    <b-dropdown-item
      @click="throwEvent('daily')"
    >
      Todos os dias
    </b-dropdown-item>
    <b-dropdown-item
      @click="throwEvent('weekly')"
    >
      Semanalmente
    </b-dropdown-item>
    <b-dropdown-item
      @click="throwEvent('monthly')"
    >
      Mensalmente
    </b-dropdown-item>
    <b-dropdown-item
      @click="throwEvent('annually')"
    >
      Anualmente
    </b-dropdown-item>
  </b-dropdown>
  </div>
</template>

<script>
export default {
  name: 'Schedule',
  data: () => ({
    selected: 'none',
    options: [
      { value: 'none', text: 'Não se repete' },
      { value: 'daily', text: 'Todos os dias' },
      { value: 'weekly', text: 'Semanalmente' },
      { value: 'monthly', text: 'Mensalmente' },
      { value: 'annually', text: 'Anualmente' }
    ]
  }),
  watch: {
    selected: function () {
      console.log('throwEvent', this.selected)
      this.$emit('throwEvent', this.selected)
    }
  },
  methods: {
    throwEvent (option) {
      this.$emit('throwEvent', option)
    }
  }
}
</script>

<style>
.dropdown-toggle {
  width: 100%;
}
</style>
