<template>
  <form-wizard
    @on-complete="complete"
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
import { Schedule, Event } from 'dayspan'
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
      datetimeValue: '',
      allDay: true,
      duration: 0,
      durationUnit: '',
      local: '',
      specialty: '',
      notify: []
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
        return {'text': i.name, 'value': i.pk}
      })
    },
    patientsParsed: function () {
      return this.patients.map(function (i) {
        return {'text': i.name, 'value': i.pk}
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
      let dt = LuxonDateTime.fromISO(this.form.datetimeValue)
      dt.c.month = dt.c.month - 1
      let hourStr = String(dt.c.hour)
      let minuteStr = String(dt.c.minute)
      let time = ''.concat(hourStr, ':', minuteStr)
      let data = {
        'calendar': this.calendarAppoint.pk,
        'color': this.calendarAppoint.color,
        'description': this.form.specialty,
        'forecolor': this.calendarAppoint.forecolor,
        'location': this.form.local,
        'notify': this.form.notify,
        'title': 'Consulta'
      }
      if (this.form.allDay) {
        let sched = new Schedule({
          'dayOfMonth': [dt.c.day],
          'month': [dt.c.month],
          'year': [dt.c.year],
          'times': [time]
        })
        let ev = new Event(sched, data)
        let payload = {
          'event': ev,
          'users': users
        }
        this.addEvent(payload)
      } else {
        let sched = new Schedule({
          'dayOfMonth': [dt.c.day],
          'month': [dt.c.month],
          'year': [dt.c.year],
          'times': [time],
          'duration': this.form.duration,
          'durationUnit': this.form.durationUnit
        })
        let ev = new Event(sched, data)
        let payload = {
          'event': ev,
          'users': users
        }
        this.addEvent(payload)
      }
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
