<template>
  <b-dropdown id="dropdown-1" text="Repetição" class="m-md-2">
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
</template>

<script>
export default {
  name: 'Schedule',
  methods: {
    throwEvent (option) {
      this.$emit('throwEvent', option)
    }
  }
}
</script>
