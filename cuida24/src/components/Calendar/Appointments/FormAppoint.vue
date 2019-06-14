<template>
  <div>
    <notifications 
      position="top center"
      classes="notif-success"
      :speed="500"
      :width="450"
      animation-name="v-fade-top"
      group="success"
    />
    <notifications 
      position="top center"
      classes="notif-error"
      :speed="500"
      :width="450"
      animation-name="v-fade-top"
      group="error"
    />

    <div v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">
      <h3>Não foi selecionado nenhum utilizador.</h3>
      <h3>Carregue <router-link :to="{ name: 'calendar' }">aqui</router-link> para escolher um.</h3>
    </div>

    <b-container v-if="usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0">
      <b-row>
        <b-col md="6" sm="12">
          <b-card bg-variant="light">
            <b-form align="left">
              <b-form-group
                id="input-group-1"
                label="Especialidade"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="formData.specialty"
                  required
                  placeholder="Introduza a especialidade da consulta"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-2"
                label="Data"
                label-for="input-2"
              >
                <datetime 
                  id="input-2"
                  class="form-control"
                  type="date" 
                  v-model="formData.dateValue"
                  :phrases="datetime.phrases"
                  :week-start="datetime['week-start']"
                  :min-datetime="datetime.minDatetime"
                  @close="updateNotify"
                ></datetime>
              </b-form-group>

              <b-form-group
                id="input-group-3"
                label="Repetição"
                label-for="input-3"
              >
                <b-form-select
                  v-model="selectedSchedule"
                  :options="optionsSchedule"
                ></b-form-select>
              </b-form-group>

              <b-form-checkbox-group
                class="mt-3 mb-3"
                v-model="formData.allDay"
                id="checkboxes-3">
                <b-form-checkbox value="true">Dia inteiro</b-form-checkbox>
              </b-form-checkbox-group>

              <b-container 
                class="m-0 p-0"
                v-if="!formData.allDay"
              >
                <b-row class="m-0 p-0">
                  <b-col cols="6" class="p-0 pr-3">
                    <b-form-group
                      id="input-group-4"
                      label="Hora"
                      label-for="input-4"
                    >
                      <datetime 
                        class="form-control"
                        type="time"
                        v-model="formData.timeValue"
                      ></datetime>
                    </b-form-group>
                  </b-col>
                  <b-col cols="6" class="p-0">
                    <b-form-group
                      id="input-group-7"
                      label="Duração"
                      label-for="input-7"
                    >
                      <b-row>
                        <b-col cols="4" class="pr-1">
                          <b-form-input
                            width="100%"
                            id="input-7"
                            v-model="formData.duration"
                            required
                            placeholder="Introduza uma duração"
                          ></b-form-input>
                        </b-col>
                        <b-col cols="8" class="pl-0">
                          <b-form-select
                            width="100%"
                            id="input-8"
                            v-model="formData.durationUnit"
                            :options="durations"
                            required
                          ></b-form-select>
                        </b-col>
                      </b-row>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-container>

              <b-form-group id="input-group-5" label="Localização" label-for="input-5">
                <b-form-input
                  id="input-5"
                  v-model="formData.local"
                  required
                  placeholder="Introduza localização"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-6" label="Notificações" label-for="input-6">
                <notification
                  :notify="formData.notify"
                ></notification>
              </b-form-group>
            </b-form>

            <b-row>
              <b-col>
                <b-button block variant="primary" v-if="formData.id === null" @click="$router.go(-1)">Cancelar</b-button>
                <b-button block variant="primary" v-if="formData.id !== null" @click="hide">Cancelar</b-button>
              </b-col>
              <b-col>
                <b-button block variant="success" @click="onSubmit">Submeter</b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col md="6" sm="12">
          <calReadOnly></calReadOnly>
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
        default: null,
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
    selectedSchedule: null,
    optionsSchedule: [
      { value: null, text: 'Não se repete' },
      { value: 'daily', text: 'Todos os dias' },
      { value: 'weekly', text: 'Semanalmente' },
      { value: 'monthly', text: 'Mensalmente' },
      { value: 'annually', text: 'Anualmente' }
    ],
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
      this.selectedSchedule = this.form.sched
    }
  },
  computed: {
    ...mapState({
      usersActive: state => state.users.usersActive
    }),
    ...mapGetters('calendars', [
      'calendarAppoint'
    ]),
    scheduleChosen () {
      return this.parseScheduleOption(this.selectedSchedule)
    }
  },
  methods: {
    ...mapActions('appointments', ['addAppointment', 'updateAppointment', 'deleteAppointment']),
    parseScheduleOption (option) {
      let result = null
      let dt = LuxonDateTime.fromISO(this.formData.dateValue)
      // let wsom = this.weekSpanOfMonth(dt)
      let dow = dt.weekday % 7
      dt.c.month = dt.c.month - 1
      switch (option) {
        case 'daily':
          result = {
            'duration': 1,
            'durationInDays': 0,
            'durationUnit': 'days'
          }
          break
        case 'weekly':
          result = {
            'dayOfWeek': [dow]
          }
          break
        case 'monthly':
          result = {
            'dayOfMonth': [dt.c.day]
          }
          break
        case 'annually':
          result = {
            'dayOfMonth': [dt.c.day],
            'month': [dt.c.month]
          }
          break
        default:
          result = {
            'dayOfMonth': [dt.c.day],
            'month': [dt.c.month],
            'year': [dt.c.year]
          }
      }
      return result
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
      this.formData.sched = this.scheduleChosen
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
          .then(() => {
            this.$emit('appointmentUpdated', payload.occurrenceDate)
          })
          .catch(() => {
            this.$notify({
              title: 'Ocorreu um erro ao atualizar a consulta.',
              duration: 3000,
              group: 'error'
            })
          })
      } else {
        this.addAppointment(payload)
          .then(() => {
            this.$notify({
              title: 'A consulta foi adicionada com sucesso.',
              duration: 3000,
              group: 'success'
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
            this.selectedSchedule = 'none'
          })
          .catch(() => {
            this.$notify({
              title: 'Ocorreu um erro ao adicionar a consulta.',
              duration: 3000,
              group: 'error'
            })
          })
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
.notif-success {
  margin: 10px;
  margin-bottom: 0;
  border-radius: 3px;
  padding: 10px 20px;
  background: #E8F9F0;
  border: 2px solid #D0F2E1;
}

.notif-error {
  margin: 10px;
  margin-bottom: 0;
  border-radius: 3px;
  padding: 10px 20px;
  background: #F9E8E8;
  border: 2px solid #FCF2F2;
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

.vdatetime-input {
  width: 100%;
}
</style>
