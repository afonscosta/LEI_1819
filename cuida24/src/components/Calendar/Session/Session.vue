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

    <ListSessions
      v-if="!sessionSel"
      @editGroupSession="editGroupSession"
      @editIndivSession="editIndivSession"
    ></ListSessions>
    <FormSession
      v-if="sessionSel"
      :formData="formData"
      :sessionData="sessionData"
      :isGroupSession="isGroupSession"
      :isIndivSession="isIndivSession"
      @groupSessionUpdated="sessionSel = !sessionSel; isGroupSession = false; isIndivSession = false"
      @indivSessionUpdated="sessionSel = !sessionSel; isGroupSession = false; isIndivSession = false"
      @hide="sessionSel = null"
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
    sessionData: null,
    isGroupSession: false,
    isIndivSession: false
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
        users: s.event.users,
        id: s.event.id
      }
      this.formData = form
      this.sessionData = s.groupSession
      this.isGroupSession = true
      this.isIndivSession = false
    },
    editIndivSession (s) {
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
        users: s.event.users,
        id: s.event.id
      }
      this.formData = form
      this.sessionData = s.individualSession
      this.isGroupSession = false
      this.isIndivSession = true
    },
    parseScheduleOption (appt) {
      var rec = null
      if (appt.event.schedule.duration &&
      appt.event.schedule.durationInDays === 0 &&
      appt.event.schedule.durationUnit &&
      !appt.event.schedule.dayOfWeek &&
      !appt.event.schedule.dayOfMonth &&
      !appt.event.schedule.month &&
      !appt.event.schedule.year) {
        rec = 'daily'
      } else if (!appt.event.schedule.durationInDays &&
      appt.event.schedule.dayOfWeek &&
      !appt.event.schedule.dayOfMonth &&
      !appt.event.schedule.month &&
      !appt.event.schedule.year) {
        rec = 'weekly'
      } else if (!appt.event.schedule.durationInDays &&
      !appt.event.schedule.dayOfWeek &&
      appt.event.schedule.dayOfMonth &&
      !appt.event.schedule.month &&
      !appt.event.schedule.year) {
        rec = 'monthly'
      } else if (!appt.event.schedule.durationInDays &&
      !appt.event.schedule.dayOfWeek &&
      appt.event.schedule.dayOfMonth &&
      appt.event.schedule.month &&
      !appt.event.schedule.year) {
        rec = 'yearly'
      }
      return rec
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
