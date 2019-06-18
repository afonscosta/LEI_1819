<template>
  <div>
    <b-container>
      <b-row sm="auto">
        <b-col cols="12">
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
    <b-button @click="goToPrescriptions">Prescrições</b-button>
  </div>
</template>

<script>
import ListUsers from '@/components/ListUsers'
import { mapState, mapActions, mapGetters } from 'vuex'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default {
  name: 'Medication',
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
    removeSelectedPatient (userPK) {
      this.patientsSelected = this.patientsSelected.filter(u => u.pk !== userPK)
      this.usersActive.patients = this.usersActive.patients.filter(pk => pk !== userPK)
    },
    addSelectedPatient (user) {
      this.patientsSelected = []
      this.patientsSelected.push(user)
      this.usersActive.patients = []
      this.usersActive.patients.push(user.pk)
    },
    goToPrescriptions () {
      this.$router.push({ name: 'prescriptions' })
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
