<template>
  <div>
    <b-container>
      <b-row sm="auto">
        <b-col md="6" cols="6">
          <ListUsers 
            :listName="'Cuidadores'"
            :users="caregivers"
            :selected="caregiversSelected"
            :readOnly="false"
            @removeSelected="removeSelectedCaregiver"
            @addSelected="addSelectedCaregiver"
          ></ListUsers>
        </b-col>
        <b-col md="6" cols="6">
          <ListUsers 
            :listName="'Utentes'"
            :users="patients"
            :selected="patientsSelected"
            :readOnly="false"
            @removeSelected="removeSelectedPatient"
            @addSelected="addSelectedPatient"
          ></ListUsers>
        </b-col>
      </b-row>
    </b-container>
    <b-button
      @click="goToAppointments"
      :disabled="
            (usersActive.caregivers.length + usersActive.patients.length) === 0 ||
            (usersActive.caregivers.length + usersActive.patients.length) > 1 ||
            usersActive.caregivers.length > 1 ||
            usersActive.patients.length > 1"
    >Consultas</b-button>
    <b-button
      @click="goToSessions"
      :disabled="
            (usersActive.caregivers.length + usersActive.patients.length) === 0 ||
            (usersActive.caregivers.length > 0 && usersActive.patients.length > 0)"
    >Sessões de Grupo / Individual</b-button>
  </div>
</template>

<script>
import ListUsers from '@/components/ListUsers'
import { mapState, mapActions, mapGetters } from 'vuex'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default {
  name: 'MenuCalendar',
  components: {
    ListUsers
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
    caregiversSelected: [],
    patientsSelected: []
  }),
  created () {
    this.$store.dispatch('calendars/getCalendars')
    this.$store.dispatch('users/getUsers')
  },
  mounted () {
    this.usersActive.caregivers = []
    this.usersActive.patients = []
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
    ])
  },
  methods: {
    ...mapActions('calendar', ['addEvent', 'updateEvent', 'deleteEvent']),
    removeSelectedCaregiver (userPK) {
      this.caregiversSelected = this.caregiversSelected.filter(u => u.pk !== userPK)
      this.usersActive.caregivers = this.usersActive.caregivers.filter(pk => pk !== userPK)
    },
    addSelectedCaregiver (user) {
      this.caregiversSelected.push(user)
      this.usersActive.caregivers.push(user.pk)
    },
    removeSelectedPatient (userPK) {
      this.patientsSelected = this.patientsSelected.filter(u => u.pk !== userPK)
      this.usersActive.patients = this.usersActive.patients.filter(pk => pk !== userPK)
    },
    addSelectedPatient (user) {
      this.patientsSelected.push(user)
      this.usersActive.patients.push(user.pk)
    },
    goToAppointments () {
      this.$router.push({ name: 'appointments' })
    },
    goToSessions () {
      this.$router.push({ name: 'sessions' })
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
