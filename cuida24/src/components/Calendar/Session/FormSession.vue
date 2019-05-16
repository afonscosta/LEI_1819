<template>
  <div>
    <h3 
      v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0"
    >Não foi selecionado nenhum utilizador.</h3>
    <h3 
      v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0"
    >Carregue <router-link :to="{ name: 'calendar' }">aqui</router-link> para escolher um.</h3>

    <b-container v-if="usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0">
      <b-row sm="auto">
        <b-col md="6" sm="12">
          <b-form @submit.prevent="onSubmit">
            <b-form-input
              id="theme"
              v-model="session.theme"
              required
              placeholder="Introduza o tema da sessão de grupo"
            ></b-form-input>

            <datetime 
              type="date" 
              v-model="form.dateValue"
              :phrases="datetime.phrases"
              :week-start="datetime['week-start']"
              :min-datetime="datetime.minDatetime"
              @close="updateNotify"
            ></datetime>

            <schedule
              @throwEvent="parseScheduleOption"
            ></schedule>

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
            
            <b-form-input
              id="input-5"
              v-model="form.local"
              required
              placeholder="Introduza localização"
            ></b-form-input>

            <notification
              :notify="form.notify"
            ></notification>

            <b-form-textarea
              id="description"
              v-model="session.description"
              required
              rows="3"
              max-rows="6"
              placeholder="Insira a descrição da sessão de grupo aqui"
            ></b-form-textarea>

            <b-list-group>
              <b-list-group-item
                v-for="g in session.goals"
                :key="g"
              >{{ g }}</b-list-group-item>
            </b-list-group>
            <b-form-input
              id="goal"
              v-model="goal"
              placeholder="Adicione um objetivo..."
            ></b-form-input>
            <b-button @click="addToGoals">Adicionar objetivo</b-button>

            <b-list-group>
              <b-list-group-item
                v-for="m in session.materials"
                :key="m"
              >{{ m }}</b-list-group-item>
            </b-list-group>
            <b-form-input
              id="item"
              v-model="item"
              placeholder="Adicione um item..."
            ></b-form-input>
            <b-button @click="addToMaterial">Adicionar item</b-button>

            <b-button type="submit" variant="primary">Submit</b-button>
          </b-form>
        </b-col>
        <b-col md="6" sm="12">
          <calReadOnly></calReadOnly>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { DateTime as LuxonDateTime } from 'luxon'
import notification from '@/components/Notification.vue'
import schedule from '@/components/Schedule'
import calReadOnly from '@/components/Calendar/CalendarReadOnly'
import { format, parse, subDays, subMonths } from 'date-fns'

export default {
  name: 'formSession',
  components: {
    notification,
    schedule,
    calReadOnly
  },
  props: {
    sessionData: {
      default: null,
      type: Object
    },
    formData: {
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
      notify: {
        default: [],
        type: Array
      },
      sched: {
        default: {},
        type: Object
      },
      participants: {
        type: Array
      },
      id: {
        default: null,
        type: Number
      }
    }
  },
  data: () => ({
    session: {
      theme: '',
      description: '',
      goals: [],
      materials: [],
      state: 'E',
      pk: null
    },
    form: {
      dateValue: '',
      timeValue: '',
      allDay: true,
      duration: 0,
      durationUnit: '',
      local: '',
      notify: [],
      sched: null,
      participants: [],
      id: null
    },
    item: '',
    goal: '',
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
    ]
  }),
  created () {
    if (this.sessionData) {
      this.session = this.sessionData
      this.form = this.formData
      console.log('dentro')
    }
    console.log('fora')
  },
  computed: {
    ...mapState({
      usersActive: state => state.users.usersActive,
      caregivers: state => state.users.users.caregivers,
      patients: state => state.users.users.patients
    }),
    ...mapGetters('calendars', [
      'calendarGroupSession',
      'calendarIndivSession'
    ])
  },
  methods: {
    ...mapActions('sessions', [
      'addGroupSession',
      'updateGroupSession',
      'deleteGroupSession',
      'addIndivSession',
      'updateIndivSession',
      'deleteIndivSession'
    ]),
    addToMaterial () {
      this.session.materials.push(this.item)
      this.item = ''
    },
    addToGoals () {
      this.session.goals.push(this.goal)
      this.goal = ''
    },
    onSubmit (evt) {
      let eventData = this.prepareEvent()
      let payload = {}
      if ((this.usersActive.caregivers.length + this.usersActive.patients.length) === 1) {
        payload = {
          'individualSession': this.session,
          'event': eventData
        }
        payload.event.data.calendar = this.calendarIndivSession.pk
        payload.event.data.color = this.calendarIndivSession.color
        payload.event.data.forecolor = this.calendarIndivSession.forecolor
        payload.event.data.title = 'Sessão Individual'
      } else {
        payload = {
          'groupSession': this.session,
          'event': eventData
        }
      }
      if (payload.groupSession && payload.event.id) {
        let gs = JSON.parse(JSON.stringify(payload))
        delete gs.event.users
        gs.event.participants = this.form.participants
        this.updateGroupSession({ send: payload, stay: gs })
        this.$emit('groupSessionUpdated', payload.event.occurrenceDate)
      } else if (payload.individualSession && payload.event.id) {
        let is = JSON.parse(JSON.stringify(payload))
        delete is.event.users
        is.event.participants = this.form.participants
        this.updateIndivSession({ send: payload, stay: is })
        this.$emit('indivSessionUpdated', payload.event.occurrenceDate)
      } else if (payload.groupSession) {
        this.addGroupSession(payload)
        this.$notify({
          title: 'A sessão de grupo foi adicionada com sucesso.',
          duration: 3000
        })
      } else if (payload.individualSession) {
        this.addIndivSession(payload)
        this.$notify({
          title: 'A sessão individual foi adicionada com sucesso.',
          duration: 3000
        })
      }
      this.session = {
        theme: '',
        description: '',
        goals: [],
        materials: [],
        state: 'E'
      }
      this.form = {
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
    prepareEvent () {
      let users = {}
      if (this.form.id !== null) {
        users = {
          caregivers: this.form.participants.filter(p => this.isCaregiver(p.pk)).map(p => p.pk),
          patients: this.form.participants.filter(p => this.isPatient(p.pk)).map(p => p.pk)
        }
      } else {
        users = {
          'caregivers': this.usersActive.caregivers,
          'patients': this.usersActive.patients
        }
      }
      let data = {
        'calendar': this.calendarGroupSession.pk,
        'color': this.calendarGroupSession.color,
        'description': this.session.theme + ' - ' + this.session.description,
        'forecolor': this.calendarGroupSession.forecolor,
        'location': this.form.local,
        'notify': this.form.notify,
        'title': 'Sessão de Grupo'
      }
      if (!this.form.sched) {
        let dt = LuxonDateTime.fromISO(this.form.dateValue)
        dt.c.month = dt.c.month - 1
        this.form.sched = {
          'dayOfMonth': [dt.c.day],
          'month': [dt.c.month],
          'year': [dt.c.year]
        }
      }
      if (!this.form.allDay) {
        let time = LuxonDateTime.fromISO(this.form.timeValue)
        let t = ''.concat(time.c.hour, ':', time.c.minute)
        this.form.sched.times = [t]
        this.form.sched.duration = this.form.duration
        this.form.sched.durationUnit = this.form.durationUnit
      }
      let dt = LuxonDateTime.fromISO(this.form.dateValue)
      let payload = {
        'data': data,
        'schedule': this.form.sched,
        'id': this.form.id,
        'users': users,
        'occurrenceDate': {
          'dayOfMonth': dt.c.day,
          'month': dt.c.month,
          'year': dt.c.year
        }
      }
      return payload
    },
    updateNotify () {
      if (this.form.dateValue) {
        var d = parse(this.form.dateValue)
        var prevMonth = format(subMonths(d, 1), 'YYYY-MM-DD') + 'T09:00:00.000Z'
        var prev3Days = format(subDays(d, 3), 'YYYY-MM-DD') + 'T09:00:00.000Z'
        this.form.notify = [prevMonth, prev3Days]
      } else {
        this.form.notify = []
      }
    },
    isCaregiver (id) {
      if (this.caregivers.find(u => u.info.pk === id)) {
        console.log('is caregiver', id)
        return true
      }
      return false
    },
    isPatient (id) {
      if (this.patients.find(u => u.info.pk === id)) {
        console.log('is patient', id)
        return true
      }
      return false
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
