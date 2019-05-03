<template>
  <b-container>
    <b-row sm="auto">
      <b-col md="6" sm="12">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">

          <b-form-group id="input-group-1" label="Especialidade:" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="formData.specialty"
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
              v-model="formData.dateValue"
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
              @throwEvent="parseScheduleOption"
            ></schedule>
          </b-form-group>

          <b-form-group
            id="input-group-3"
            label="Duração:"
            label-for="input-3"
          >
            <b-form-checkbox-group v-model="formData.allDay" id="checkboxes-3">
              <b-form-checkbox value="true">Dia inteiro</b-form-checkbox>
            </b-form-checkbox-group>

            <datetime 
              type="time"
              v-if="!formData.allDay"
              v-model="formData.timeValue"
            ></datetime>
            <b-form-input
              v-if="!formData.allDay"
              id="input-3"
              v-model="formData.duration"
              required
              placeholder="Duração"
            ></b-form-input>
            <b-form-select
              v-if="!formData.allDay"
              id="input-4"
              v-model="formData.durationUnit"
              :options="durations"
              required
            ></b-form-select>
          </b-form-group>

          <b-form-group id="input-group-5" label="Localização:" label-for="input-5">
            <b-form-input
              id="input-5"
              v-model="formData.local"
              required
              placeholder="Introduza localização"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-6" label="Notificações:" label-for="input-6">
            <notification
              :notify="formData.notify"
            ></notification>
          </b-form-group>
        </b-form>
      </b-col>
      <b-col md="6" sm="12">
        <calReadOnly></calReadOnly>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button variant="outline-dark" @click="submit">Submeter</b-button>
      </b-col>
    </b-row>

  </b-container>
</template>

<script>
import { DateTime as LuxonDateTime } from 'luxon'
import notification from './Notification.vue'
import schedule from './Schedule'
import calReadOnly from './CalendarReadOnly'
import { mapActions, mapState, mapGetters } from 'vuex'

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
        default: '',
        type: String
      },
      timeValue: {
        default: '',
        type: String
      },
      allDay: {
        default: true,
        type: Boolean
      },
      duration: {
        default: 0,
        type: Number
      },
      durationUnit: {
        default: '',
        type: String
      },
      local: {
        default: '',
        type: String
      },
      specialty: {
        default: '',
        type: String
      },
      notify: {
        default: [],
        type: Array
      },
      sched: {
        default: {},
        type: Object
      },
      id: {
        default: null,
        type: Number
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
    show: true,
    formData: {
      dateValue: '',
      timeValue: '',
      allDay: true,
      duration: 0,
      durationUnit: '',
      local: '',
      specialty: '',
      notify: [],
      sched: null,
      id: null
    }
  }),
  created () {
    if (this.form) {
      this.formData = this.form
    }
  },
  computed: {
    ...mapState({
      usersActive: state => state.users.usersActive
    }),
    ...mapGetters('calendars', [
      'calendarAppoint'
    ])
  },
  methods: {
    ...mapActions('calendar', ['addEvent', 'updateEvent', 'deleteEvent']),
    onSubmit (evt) {
      evt.preventDefault()
      alert(JSON.stringify(this.formData))
    },
    onReset (evt) {
      evt.preventDefault()
      // Reset our form values
      this.datetimeValue = ''
      this.local = ''
      this.specialty = ''
      this.notify = []
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    parseScheduleOption (option) {
      console.log('OPTION', option)
      let dt = LuxonDateTime.fromISO(this.formData.dateValue)
      // let wsom = this.weekSpanOfMonth(dt)
      let dow = dt.weekday % 7
      dt.c.month = dt.c.month - 1
      switch (option) {
        case 'daily':
          this.formData.sched = {
            'duration': 1,
            'durationInDays': 0,
            'durationUnit': 'days'
          }
          break
        case 'weekly':
          this.formData.sched = {
            'dayOfWeek': [dow]
          }
          break
        case 'monthly':
          this.formData.sched = {
            'dayOfMonth': [dt.c.day]
          }
          break
        case 'annually':
          this.formData.sched = {
            'dayOfMonth': [dt.c.day],
            'month': [dt.c.month]
          }
          break
        default:
          this.formData.sched = {
            'dayOfMonth': [dt.c.day],
            'month': [dt.c.month],
            'year': [dt.c.year]
          }
      }
    },
    submit () {
      const users = {
        'caregivers': this.usersActive.caregivers,
        'patients': this.usersActive.patients
      }
      let data = {
        'calendar': this.calendarAppoint.pk,
        'color': this.calendarAppoint.color,
        'description': this.formData.specialty,
        'forecolor': this.calendarAppoint.forecolor,
        'location': this.formData.local,
        'notify': this.formData.notify,
        'title': 'Consulta'
      }
      if (!this.formData.sched) {
        let dt = LuxonDateTime.fromISO(this.formData.dateValue)
        dt.c.month = dt.c.month - 1
        this.formData.sched = {
          'dayOfMonth': [dt.c.day],
          'month': [dt.c.month],
          'year': [dt.c.year]
        }
      }
      if (!this.formData.allDay) {
        let time = LuxonDateTime.fromISO(this.formData.timeValue)
        let t = ''.concat(time.c.hour, ':', time.c.minute)
        this.formData.sched.times = [t]
        this.formData.sched.duration = this.formData.duration
        this.formData.sched.durationUnit = this.formData.durationUnit
      }
      let dt = LuxonDateTime.fromISO(this.formData.dateValue)
      let payload = {
        'event': {
          'data': data,
          'schedule': this.formData.sched,
          'id': this.formData.id
        },
        'users': users,
        'occurrenceDate': {
          'dayOfMonth': dt.c.day,
          'month': dt.c.month,
          'year': dt.c.year
        }
      }
      if (payload.event.id) {
        this.updateEvent(payload)
        this.$emit('eventUpdated', payload.occurrenceDate)
        // this.$router.push({ name: 'editAppoints' })
      } else {
        this.addEvent(payload)
        this.$router.push({ name: 'menuCalendar' })
      }
      // this.formData = {
      //   dateValue: '',
      //   timeValue: '',
      //   allDay: true,
      //   duration: 0,
      //   durationUnit: '',
      //   local: '',
      //   specialty: '',
      //   notify: [],
      //   sched: {},
      //   id: null
      // }
      // this.$router.push({ name: 'menuCalendar' })
    }
  }
}
</script>
