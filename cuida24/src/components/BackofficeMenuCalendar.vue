<template>
  <form-wizard
    @on-complete="complete"
    title="Gestão do calendário"
    subtitle="Adicionar e editar eventos"
  >
    <tab-content title="Escolha da operação">
      <b-container>
        <b-row sm="auto">
          <b-col md="4" sm="12">
            <listUsers 
              :listName="'Cuidadores'"
              :users="caregiversParsed"
              :selected="caregiversSelected"
              @toggleAll="toggleAllCaregivers"
              @updateSelected="updateSelectedCaregivers"
            ></listUsers>
          </b-col>
          <b-col md="4" sm="12">
            <listUsers 
              :listName="'Utentes'"
              :users="patientsParsed"
              :selected="patientsSelected"
              @toggleAll="toggleAllPatients"
              @updateSelected="updateSelectedPatients"
            ></listUsers>
          </b-col>
          <b-col md="4" sm="12">
            <b-form-group label="Operações disponíveis">
            <b-form-radio-group
              id="btn-radios-3"
              v-model="selected"
              :options="options"
              buttons
              button-variant="light"
              stacked
              name="radio-btn-stacked"
            ></b-form-radio-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
    </tab-content>
    <tab-content title="Realização da operação">
      <b-container>
        <b-row sm="auto">
          <b-col md="6" sm="12">
            <addAppoint 
              v-if="this.selected === 'addAppoint'"
              :form="form"
              @throwEvent="parseScheduleOption"
            ></addAppoint>
            <editAppoint 
              v-if="this.selected === 'editAppoint'"
              :form="form"
            ></editAppoint>
          </b-col>
          <b-col md="6" sm="12">
            <calReadOnly></calReadOnly>
          </b-col>
        </b-row>
      </b-container>
      <h4 v-if="this.selected === 'addMedication'">Adicionar medicação</h4>
      <calReadOnly v-if="this.selected === 'editMedication'"></calReadOnly>
    </tab-content>
  </form-wizard>
</template>

<script>
import listUsers from './ListUsers'
import calReadOnly from './CalendarioReadOnly'
import addAppoint from './BackofficeFormAddAppoint'
import editAppoint from './BackofficeEditAppoint'
import { mapState, mapActions, mapGetters } from 'vuex'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import { DateTime as LuxonDateTime } from 'luxon'

export default {
  name: 'BackofficeMenuCalendar',
  components: {
    listUsers,
    calReadOnly,
    addAppoint,
    editAppoint,
    FormWizard,
    TabContent
  },
  data: () => ({
    form: {
      dateValue: '',
      timeValue: '',
      allDay: true,
      duration: 0,
      durationUnit: '',
      local: '',
      specialty: '',
      notify: [],
      sched: null
    },
    caregiversSelected: [],
    patientsSelected: [],
    selected: '',
    options: [
      { text: 'Adicionar consulta', value: 'addAppoint' },
      { text: 'Editar consulta', value: 'editAppoint' },
      { text: 'Adicionar medicação', value: 'addMedication' },
      { text: 'Editar medicação', value: 'editMedication' },
      { text: 'Adicionar sessão de grupo', value: 'addGroupSession' },
      { text: 'Editar sessão de grupo', value: 'editGroupSession' },
      { text: 'Adicionar sessão individual', value: 'addIndividualSession' },
      { text: 'Editar sessão individual', value: 'editIndividualSession' }
    ]
  }),
  created () {
    this.$store.dispatch('calendars/getCalendars')
    this.$store.dispatch('users/getUsers')
  },
  computed: {
    ...mapState({
      caregivers: state => state.users.users.caregivers,
      patients: state => state.users.users.patients,
      calendars: state => state.calendars.calendars
    }),
    ...mapGetters('calendars', [
      'calendarAppoint'
    ]),
    caregiversParsed: function () {
      return this.caregivers.map(function (i) {
        return {'text': i.info.name, 'value': i.pk}
      })
    },
    patientsParsed: function () {
      return this.patients.map(function (i) {
        return {'text': i.info.name, 'value': i.pk}
      })
    }
  },
  methods: {
    ...mapActions('calendar', ['addEvent', 'updateEvent', 'deleteEvent']),
    toggleAllCaregivers (checked) {
      this.caregiversSelected = checked ? this.caregivers.slice() : []
    },
    updateSelectedCaregivers (checked) {
      this.caregiversSelected = checked
    },
    toggleAllPatients (checked) {
      this.patientsSelected = checked ? this.patients.slice() : []
    },
    updateSelectedPatients (checked) {
      this.patientsSelected = checked
    },
    complete () {
      const users = {
        'caregivers': this.caregiversSelected,
        'patients': this.patientsSelected
      }
      let data = {
        'calendar': this.calendarAppoint.pk,
        'color': this.calendarAppoint.color,
        'description': this.form.specialty,
        'forecolor': this.calendarAppoint.forecolor,
        'location': this.form.local,
        'notify': this.form.notify,
        'title': 'Consulta'
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
      // let sched = new Schedule(this.form.sched)
      // let ev = new Event(sched, data)
      let payload = {
        'event': {
          'data': data,
          'schedule': this.form.sched,
          'id': null
        },
        'users': users
      }
      this.addEvent(payload)
    },
    parseScheduleOption (option) {
      let dt = LuxonDateTime.fromISO(this.form.dateValue)
      let wsom = this.weekSpanOfMonth(dt)
      let dow = dt.weekday % 7
      dt.c.month = dt.c.month - 1
      switch (option) {
        case 'daily':
          this.form.sched = {
            'duration': 1,
            'durationInDays': 0,
            'durationUnit': 'days'
          }
          break
        case 'weekly':
          this.form.sched = {
            'dayOfWeek': [dow]
          }
          break
        case 'monthly':
          this.form.sched = {
            'dayOfWeek': [dow],
            'weekspanOfMonth': [wsom]
          }
          break
        case 'monthlyByDay':
          this.form.sched = {
            'dayOfMonth': [dt.c.day]
          }
          break
        case 'annually':
          this.form.sched = {
            'dayOfWeek': [dow],
            'month': [dt.c.month],
            'weekspanOfMonth': [wsom]
          }
          break
        case 'annuallyByDay':
          this.form.sched = {
            'dayOfMonth': [dt.c.day],
            'month': [dt.c.month]
          }
          break
        case 'everyWeekday':
          this.form.sched = {
            'dayOfWeek': [1, 2, 3, 4, 5]
          }
          break
        case 'custom':
          this.form.sched = {
            'custom': 'custom'
          }
          break
        default:
          this.form.sched = {
            'dayOfMonth': [dt.c.day],
            'month': [dt.c.month],
            'year': [dt.c.year]
          }
      }
    },
    weekSpanOfMonth (dt) {
      // month_number is in the range 1..12
      let date = new Date(''.concat(dt.c.year, '-', dt.c.month, '-', dt.c.day))
      var firstWeekday = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
      var offsetDate = date.getDate() + firstWeekday - 1
      return Math.floor(offsetDate / 7)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

img {
  width: 250px;
}
</style>
