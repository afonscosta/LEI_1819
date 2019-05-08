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
              v-model="groupSession.theme"
              required
              placeholder="Introduza o tema da sessão de grupo"
            ></b-form-input>

            <datetime 
              type="date" 
              v-model="form.dateValue"
              :phrases="datetime.phrases"
              :week-start="datetime['week-start']"
              :min-datetime="datetime.minDatetime"
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
              v-model="groupSession.description"
              required
              rows="3"
              max-rows="6"
              placeholder="Insira a descrição da sessão de grupo aqui"
            ></b-form-textarea>

            <b-list-group>
              <b-list-group-item
                v-for="g in groupSession.goals"
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
                v-for="m in groupSession.material"
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
import { mapGetters, mapState } from 'vuex'
import { DateTime as LuxonDateTime } from 'luxon'
import notification from '@/components/Notification.vue'
import schedule from '@/components/Schedule'
import calReadOnly from '@/components/Calendar/CalendarReadOnly'

export default {
  name: 'formGroupSession',
  components: {
    notification,
    schedule,
    calReadOnly
  },
  props: {
    groupSessionData: {
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
      id: {
        default: null,
        type: Number
      }
    }
  },
  data: () => ({
    groupSession: {
      theme: '',
      description: '',
      goals: [],
      material: [],
      state: 'waiting'
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
    ],
    show: true,
    form: {
      dateValue: '',
      timeValue: '',
      allDay: true,
      duration: 0,
      durationUnit: '',
      local: '',
      notify: [],
      sched: null,
      id: null
    }
  }),
  created () {
    if (this.groupSessionData) {
      this.groupSession = this.groupSessionData
      this.form = this.formData
    }
  },
  computed: {
    ...mapState({
      usersActive: state => state.users.usersActive
    }),
    ...mapGetters('calendars', [
      'calendarGroupSession'
    ])
  },
  methods: {
    addToMaterial () {
      this.groupSession.material.push(this.item)
      this.item = ''
    },
    addToGoals () {
      this.groupSession.goals.push(this.goal)
      this.goal = ''
    },
    onSubmit (evt) {
      let eventData = this.prepareEvent()
      let payload = {
        'groupSession': this.groupSession,
        'event': eventData
      }
      this.$emit('returnGroupSession', payload)
      this.groupSession = {
        theme: '',
        description: '',
        goals: [],
        material: [],
        state: 'waiting'
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
      const users = {
        'caregivers': this.usersActive.caregivers,
        'patients': this.usersActive.patients
      }
      let data = {
        'calendar': this.calendarGroupSession.pk,
        'color': this.calendarGroupSession.color,
        'description': this.groupSession.theme + ' - ' + this.groupSession.description,
        'forecolor': this.calendarGroupSession.forecolor,
        'location': this.form.local,
        'notify': this.form.notify,
        'title': 'Sessão de grupo'
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
    }
  }
}
</script>
