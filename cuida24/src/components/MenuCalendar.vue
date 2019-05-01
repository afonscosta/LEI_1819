<template>
  <div>
    <b-container v-if="selected === ''">
      <b-row sm="auto">
        <b-col md="6" cols="6">
          <listUsers 
            :listName="'Cuidadores'"
            :users="caregiversParsed"
            :selected="usersActive.caregivers"
            @toggleAll="toggleAllCaregivers"
            @updateSelected="updateSelectedCaregivers"
          ></listUsers>
        </b-col>
        <b-col md="6" cols="6">
          <listUsers 
            :listName="'Utentes'"
            :users="patientsParsed"
            :selected="usersActive.patients"
            @toggleAll="toggleAllPatients"
            @updateSelected="updateSelectedPatients"
          ></listUsers>
        </b-col>
      </b-row>
    </b-container>
    <router-link :to="{ name: 'formAppoint' }">Adicionar Consulta</router-link> |
    <router-link :to="{ name: 'editAppoints' }">Editar Consultas</router-link>
    <addAppoint 
      v-if="selected === 'addAppoint'"
      :form="form"
      @throwEvent="parseScheduleOption"
    ></addAppoint>
    <editAppoints 
      v-if="selected === 'editAppoint'"
      :form="form"
      @editAppointment="editAppointment"
    ></editAppoints>
    <h4 v-if="selected === 'addMedication'">Adicionar medicação</h4>
  </div>
</template>

<script>
import listUsers from './ListUsers'
import addAppoint from './FormAppoint'
import editAppoints from './EditAppoints'
import { mapState, mapActions, mapGetters } from 'vuex'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default {
  name: 'MenuCalendar',
  components: {
    listUsers,
    addAppoint,
    editAppoints,
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
      sched: null,
      id: null
    },
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
      calendars: state => state.calendars.calendars,
      usersActive: state => state.users.usersActive
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
    },
    user: function () {
      if (this.caregiversSelected) {
        return this.caregiversSelected[0]
      } else if (this.patientsSelected) {
        return this.patientsSelected[0]
      }
    }
  },
  methods: {
    ...mapActions('calendar', ['addEvent', 'updateEvent', 'deleteEvent']),
    toggleAllCaregivers (checked) {
      this.usersActive.caregivers = checked ? this.caregivers.slice() : []
    },
    updateSelectedCaregivers (checked) {
      this.usersActive.caregivers = checked
    },
    toggleAllPatients (checked) {
      this.usersActive.patients = checked ? this.patients.slice() : []
    },
    updateSelectedPatients (checked) {
      this.usersActive.patients = checked
    }
    // weekSpanOfMonth (dt) {
    //   // month_number is in the range 1..12
    //   let date = new Date(''.concat(dt.c.year, '-', dt.c.month, '-', dt.c.day))
    //   var firstWeekday = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    //   var offsetDate = date.getDate() + firstWeekday - 1
    //   return Math.floor(offsetDate / 7)
    // }
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
