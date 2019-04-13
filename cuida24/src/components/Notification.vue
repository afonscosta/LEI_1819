<template>

  <div class="notification">
    <h3>Notificações</h3>
    <div v-for="(notif, index) in notify">
      <datetime type="datetime" 
        v-model="notify[index]"
        :phrases="datetime.phrases"
        :week-start="datetime['week-start']"
        :min-datetime="datetime.minDatetime"
      ></datetime>
      <b-button @click="removeNotification(index)"></b-button>
    </div>

    <h3>Nova notificação</h3>
		<datetime type="datetime" 
			v-model="datetime.datetime"
			:phrases="datetime.phrases"
      :week-start="datetime['week-start']"
      :min-datetime="datetime.minDatetime"
      @input="addNotification"
		></datetime>
  </div>

</template>

<script>
import { DateTime as LuxonDateTime } from 'luxon'

export default {
  name: 'notification',
  props:
  {
    notify:
    {
      required: true,
      type: Array
    },
    readOnly:
    {
      type: Boolean,
      default: false
    }
  },
  data: vm => ({
    details: vm.$dayspan.getDefaultEventDetails(),
    datetime: {
      datetime: '',
      phrases: {ok: 'Ok', cancel: 'Cancelar'},
      minDatetime: LuxonDateTime.local().toISO(),
      'week-start': 7
    }
  }),
  computed:
  {
    isReadOnly () {
      console.log(this.notify)
      return this.readOnly || this.$dayspan.readOnly
    }
  },
  methods:
  {
    addNotification (notif) {
      if (notif) {
        this.notify.push(notif)
      }
    },
    removeNotification (index) {
      this.notify.splice(index, 1)
    }
  }
}
</script>

<style>
</style>
