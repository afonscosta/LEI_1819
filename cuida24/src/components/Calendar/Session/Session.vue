<template>
  <div>
    <notifications 
      position="top center"
      classes="notif"
      :speed="500"
      :width="450"
      animation-name="v-fade-top"
    />

    <h3 v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">
      Não foi selecionado nenhum utilizador.
    </h3>

    <h3 v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">
      Carregue <router-link :to="{ name: 'calendar' }">aqui</router-link> para escolher um.
    </h3>

    <b-container v-if="usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0">
      <b-row class="justify-content-md-center">
        <b-col xl="8" lg="8" md="8" sm="12" cols="12">
          <b-button 
            @click="goToFormSession"
          >Adicionar Sessão</b-button>
        </b-col>
      </b-row>
    </b-container>

    <ListSessions
      v-if="!sessionSel"
      @editGroupSession="editGroupSession"
      @editIndivSession="editIndivSession"
    ></ListSessions>
    <FormSession
      v-if="sessionSel"
      :formData="formData"
      :sessionData="sessionData"
      @groupSessionUpdated="groupSessionUpdated"
      @indivSessionUpdated="indivSessionUpdated"
    ></FormSession>
  </div>
</template>

<script>
import FormSession from './FormSession'
import ListSessions from './ListSessions'
import { mapState, mapActions } from 'vuex'
import { DateTime as LuxonDateTime } from 'luxon'

export default {
  name: 'Session',
  components: {
    FormSession,
    ListSessions
  },
  data: () => ({
    sessionSel: null,
    formData: null,
    sessionData: null
  }),
  computed: {
    ...mapState({
      usersActive: state => state.users.usersActive
    })
  },
  methods: {
    ...mapActions('sessions', ['addGroupSession', 'addIndivSession']),
    beforeAddSession (s) {
      if (s.groupSession) {
        this.addGroupSession(s)
      } else {
        this.addIndivSession(s)
      }
    },
    editGroupSession (s) {
      console.log('s', s)
      this.sessionSel = true
      var time = ''
      if (s.event.schedule.times) {
        var timeSplit = s.event.schedule.times[0].split(':')
        time = LuxonDateTime.fromObject({
          hour: timeSplit[0],
          minute: timeSplit[1],
          second: timeSplit[2]
        }).toISO()
      }
      var form = {
        dateValue: new Date(
          s.event.occurrenceDate.year,
          s.event.occurrenceDate.month - 1,
          s.event.occurrenceDate.dayOfMonth + 1
        ).toISOString(),
        timeValue: time,
        allDay: !s.event.schedule.times,
        duration: s.event.schedule.duration ? s.event.schedule.duration : 0,
        durationUnit: s.event.schedule.durationUnit ? s.event.schedule.durationUnit : '',
        local: s.event.data.location,
        notify: s.event.data.notify,
        sched: this.parseScheduleOption(s),
        id: s.event.id
      }
      this.formData = form
      this.sessionData = s.groupSession
      // this.sessionData.state = 'waiting'
      console.log('formData', this.formData)
      console.log('sessionData', this.sessionData)
      console.log('sessionSel', this.sessionSel)
    },
    editIndivSession (s) {
      console.log('s', s)
      this.sessionSel = true
      var time = ''
      if (s.event.schedule.times) {
        var timeSplit = s.event.schedule.times[0].split(':')
        time = LuxonDateTime.fromObject({
          hour: timeSplit[0],
          minute: timeSplit[1],
          second: timeSplit[2]
        }).toISO()
      }
      var form = {
        dateValue: new Date(
          s.event.occurrenceDate.year,
          s.event.occurrenceDate.month - 1,
          s.event.occurrenceDate.dayOfMonth + 1
        ).toISOString(),
        timeValue: time,
        allDay: !s.event.schedule.times,
        duration: s.event.schedule.duration ? s.event.schedule.duration : 0,
        durationUnit: s.event.schedule.durationUnit ? s.event.schedule.durationUnit : '',
        local: s.event.data.location,
        notify: s.event.data.notify,
        sched: this.parseScheduleOption(s),
        id: s.event.id
      }
      this.formData = form
      this.sessionData = s.individualSession
      // this.sessionData.state = 'waiting'
      console.log('formData', this.formData)
      console.log('sessionData', this.sessionData)
      console.log('sessionSel', this.sessionSel)
    },
    parseScheduleOption (appt) {
      var rec = null
      if (appt.event.schedule.duration === 1 &&
      appt.event.schedule.durationInDays === 0 &&
      appt.event.schedule.durationUnit === 'days' &&
      !appt.event.schedule.times &&
      !appt.event.schedule.dayOfWeek &&
      !appt.event.schedule.dayOfMonth &&
      !appt.event.schedule.month &&
      !appt.event.schedule.year) {
        rec = 'daily'
      } else if (!appt.event.schedule.duration &&
      !appt.event.schedule.durationInDays &&
      !appt.event.schedule.durationUnit &&
      !appt.event.schedule.times &&
      appt.event.schedule.dayOfWeek &&
      !appt.event.schedule.dayOfMonth &&
      !appt.event.schedule.month &&
      !appt.event.schedule.year) {
        rec = 'weekly'
      } else if (!appt.event.schedule.duration &&
      !appt.event.schedule.durationInDays &&
      !appt.event.schedule.durationUnit &&
      !appt.event.schedule.times &&
      !appt.event.schedule.dayOfWeek &&
      appt.event.schedule.dayOfMonth &&
      !appt.event.schedule.month &&
      !appt.event.schedule.year) {
        rec = 'monthly'
      } else if (!appt.event.schedule.duration &&
      !appt.event.schedule.durationInDays &&
      !appt.event.schedule.durationUnit &&
      !appt.event.schedule.times &&
      !appt.event.schedule.dayOfWeek &&
      appt.event.schedule.dayOfMonth &&
      appt.event.schedule.month &&
      !appt.event.schedule.year) {
        rec = 'yearly'
      }
      return rec
    },
    goToFormSession () {
      this.$router.push({ name: 'formSession' })
    },
    groupSessionUpdated (occurrenceDate) {
      this.sessionSel = false
      this.$notify({
        title: 'A sessão de grupo foi atualizada com sucesso.',
        duration: 3000
      })
    },
    indivSessionUpdated (occurrenceDate) {
      this.sessionSel = false
      this.$notify({
        title: 'A sessão individual foi atualizada com sucesso.',
        duration: 3000
      })
    }
  }
}
</script>
