<template>
  <div>
    <notifications 
      position="top center"
      classes="notif"
      :speed="500"
      :width="450"
      animation-name="v-fade-top"
    />
    <h3 v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">Não foi selecionado nenhum utilizador.</h3>
    <h3 v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">Carregue <router-link :to="{ name: 'calendar' }">aqui</router-link> para escolher um.</h3>
    <b-container v-if="usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0">
      <b-row sm="auto">
        <b-col md="6" sm="12">
          <b-form>

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
                @close="updateNotify"
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
          <b-button variant="primary" v-if="formData.id === null" @click="$router.go(-1)">Cancelar</b-button>
          <b-button variant="primary" v-if="formData.id !== null" @click="hide">Cancelar</b-button>
          <b-button variant="primary" @click="onSubmit">Submeter</b-button>
        </b-col>
      </b-row>

    </b-container>
  </div>
</template>

<script>
import { DateTime as LuxonDateTime } from 'luxon'
import notification from '@/components/Notification.vue'
import schedule from '@/components/Schedule'
import calReadOnly from '@/components/Calendar/CalendarReadOnly'
import { mapActions, mapState, mapGetters } from 'vuex'
import { format, parse, subDays, subMonths } from 'date-fns'

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
    ...mapActions('appointments', ['addAppointment', 'updateAppointment', 'deleteAppointment']),
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
    onSubmit () {
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
        this.updateAppointment(payload)
        this.$emit('appointmentUpdated', payload.occurrenceDate)
        // this.$router.push({ name: 'editAppoints' })
      } else {
        this.addAppointment(payload)
        this.$notify({
          title: 'A consulta foi adicionada com sucesso.',
          duration: 3000
        })
        this.formData = {
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
      }
    },
    updateNotify () {
      if (this.formData.dateValue) {
        var d = parse(this.formData.dateValue)
        var prevMonth = format(subMonths(d, 1), 'YYYY-MM-DD') + 'T09:00:00.000Z'
        var prev3Days = format(subDays(d, 3), 'YYYY-MM-DD') + 'T09:00:00.000Z'
        this.formData.notify = [prevMonth, prev3Days]
      } else {
        this.formData.notify = []
      }
    },
    hide () {
      this.$emit('hide')
    }
  }
}
</script>

<style>
.notif {
  margin: 10px;
  margin-bottom: 0;
  border-radius: 3px;
  padding: 10px 20px;
  background: #E8F9F0;
  border: 2px solid #D0F2E1;
}

.notification-title {
  letter-spacing: 1px;
  font-size: 17px;
  text-align: center;
}

.v-fade-top-enter-active,
.v-fade-top-leave-active,
.v-fade-ltopmove {
  transition: all .5s;
}
.v-fade-top-enter,
.v-fade-top-leave-to {
  opacity: 0;
  transform: translateY(-500px) scale(0.2);
}
</style>
