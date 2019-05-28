<template>
  <div class="notification">
    <b-container class="p-0">
      <b-row class="mb-1" align-v="center" align-h="around" :key="index" v-for="(notif, index) in notify">
        <b-col cols="10" class="pr-0">
          <datetime type="datetime" 
            class="form-control"
            v-model="notify[index]"
            :phrases="datetime.phrases"
            :week-start="datetime['week-start']"
            :min-datetime="datetime.minDatetime"
          ></datetime>
        </b-col>
        <b-col cols="2" class="pr-0">
          <b-button class="p-0 ml-2" variant="danger" @click="removeNotification(index)"><v-icon>delete</v-icon></b-button>
        </b-col>
      </b-row>
    </b-container>

    <div class="mt-2 new-notify">
      <datetime type="datetime" 
        class="form-control"
        v-model="datetime.datetime"
        :phrases="datetime.phrases"
        :week-start="datetime['week-start']"
        :min-datetime="datetime.minDatetime"
        placeholder="Adicionar notificação"
        @input="addNotification"
      ></datetime>
    </div>
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
        this.datetime.datetime = null
      }
    },
    removeNotification (index) {
      this.notify.splice(index, 1)
    }
  }
}
</script>

<style>
.vdatetime-input {
  width: 100%;
}

div.new-notify .vdatetime-input {
  cursor: pointer;
}

div.new-notify ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: white;
  opacity: 1; /* Firefox */
  text-align: center;
}

div.new-notify .vdatetime {
  background-color: #6c757d;
}
</style>
