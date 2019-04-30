<template>
  <b-container>
    <b-row sm="auto">
      <b-col md="6" sm="12">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">

          <b-form-group id="input-group-1" label="Especialidade:" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="form.specialty"
              required
              placeholder="Introduza a especialidade da consulta"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-2"
            label="Data/Hora:"
            label-for="input-2"
          >
            <datetime 
              type="date" 
              v-model="form.dateValue"
              :phrases="datetime.phrases"
              :week-start="datetime['week-start']"
              :min-datetime="datetime.minDatetime"
            ></datetime>
          </b-form-group>

          <b-form-group
            id="input-group-6"
            label="Repetição:"
            label-for="input-6"
          >
            <schedule
              @throwEvent="throwEvent"
            ></schedule>
          </b-form-group>

          <b-form-group
            id="input-group-3"
            label="Duração:"
            label-for="input-3"
          >
            <b-form-checkbox-group v-model="form.allDay" id="checkboxes-3">
              <b-form-checkbox value="true">Dia inteiro</b-form-checkbox>
            </b-form-checkbox-group>

            <datetime 
              type="time"
              v-if="!form.allDay"
              v-model="form.timeValue"
            ></datetime>
            <b-form-input
              v-if="!form.allDay"
              id="input-3"
              v-model="form.duration"
              required
              placeholder="Duração"
            ></b-form-input>
            <b-form-select
              v-if="!form.allDay"
              id="input-4"
              v-model="form.durationUnit"
              :options="durations"
              required
            ></b-form-select>
          </b-form-group>

          <b-form-group id="input-group-5" label="Localização:" label-for="input-5">
            <b-form-input
              id="input-5"
              v-model="form.local"
              required
              placeholder="Introduza localização"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-6" label="Notificações:" label-for="input-6">
            <notification
              :notify="form.notify"
            ></notification>
          </b-form-group>
        </b-form>
      </b-col>
      <b-col md="6" sm="12">
        <calReadOnly :users="users"></calReadOnly>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { DateTime as LuxonDateTime } from 'luxon'
import notification from './Notification.vue'
import schedule from './Schedule'
import calReadOnly from './CalendarioReadOnly'

export default {
  name: 'addAppoint',
  components: {
    notification,
    schedule,
    calReadOnly
  },
  props: {
    form: {
      dateValue: {
        required: true,
        type: String
      },
      timeValue: {
        required: true,
        type: String
      },
      allDay: {
        required: true,
        type: Boolean
      },
      duration: {
        required: true,
        type: Number
      },
      durationUnit: {
        required: true,
        type: String
      },
      local: {
        required: true,
        type: String
      },
      specialty: {
        required: true,
        type: String
      },
      notify: {
        required: true,
        type: Array
      }
    },
    users: {
      caregivers: {
        default: [],
        type: Array
      },
      patients: {
        default: [],
        type: Array
      }
    }
  },
  data: () => ({
    datetime: {
      phrases: {ok: 'Ok', cancel: 'Cancelar'},
      minDatetime: LuxonDateTime.local().toISO(),
      'week-start': 7
    },
    durations: [
      { text: 'minuto', value: 'minutes' },
      { text: 'hora', value: 'hours' },
      { text: 'dia', value: 'days' },
      { text: 'semana', value: 'weeks' },
      { text: 'mês', value: 'months' }
    ],
    show: true
  }),
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      alert(JSON.stringify(this.form))
    },
    onReset (evt) {
      evt.preventDefault()
      // Reset our form values
      this.datetimeValue = ''
      this.local = ''
      this.specialty = null
      this.notify = []
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    throwEvent (option) {
      this.$emit('throwEvent', option)
    }
  }
}
</script>
