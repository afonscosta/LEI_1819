<template>
  <div>
    <notifications 
      position="top center"
      classes="notif"
      :speed="500"
      :width="450"
      animation-name="v-fade-top"
    />
    <b-container>
      <b-row class="justify-content-md-center">
        <b-col xl="8" lg="8" md="8" sm="12" cols="12">
          <b-button 
            v-if="(usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0) && appointments.length !== 0"
            @click="goToFormAppoint">Adicionar Consulta</b-button>
        </b-col>
      </b-row>
    </b-container>
    <listAppoints 
      v-if="!appointmentSel"
      @editAppointment="editAppointment"
    ></listAppoints>
    <formAppoint 
      v-if="appointmentSel"
      :form="form"
      @appointmentUpdated="appointmentUpdated"
      @hide="appointmentSel = null"
    ></formAppoint>
  </div>
</template>

<script>
import listAppoints from './ListAppoints'
import formAppoint from './FormAppoint'
import { mapState } from 'vuex'
import { DateTime as LuxonDateTime } from 'luxon'

export default {
  name: 'editAppoints',
  components: {
    listAppoints,
    formAppoint
  },
  props: {
  },
  data: () => ({
    appointmentSel: null,
    form: {}
  }),
  created () {
  },
  computed: {
    ...mapState({
      appointments: state => state.appointments.appointments,
      usersActive: state => state.users.usersActive
    })
  },
  methods: {
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
        rec = 'annually'
      }
      return rec
    },
    editAppointment (appt) {
      this.appointmentSel = appt.appointmentPK
      var time = ''
      if (appt.event.schedule.times) {
        var timeSplit = appt.event.schedule.times[0].split(':')
        time = LuxonDateTime.fromObject({
          hour: timeSplit[0],
          minute: timeSplit[1],
          second: timeSplit[2]
        }).toISO()
      }
      var form = {
        dateValue: new Date(
          appt.occurrenceDate.year,
          appt.occurrenceDate.month - 1,
          appt.occurrenceDate.dayOfMonth + 1
        ).toISOString(),
        timeValue: time,
        allDay: !appt.event.schedule.times,
        duration: appt.event.schedule.duration ? appt.event.schedule.duration : 0,
        durationUnit: appt.event.schedule.durationUnit ? appt.event.schedule.durationUnit : '',
        local: appt.event.data.location,
        specialty: appt.event.data.description,
        notify: appt.event.data.notify,
        sched: this.parseScheduleOption(appt),
        id: appt.event.id
      }
      this.form = form
    },
    appointmentUpdated (occurrenceDate) {
      this.appointmentSel = null
      this.$notify({
        title: 'A consulta foi atualizada com sucesso.',
        duration: 3000
      })
    },
    goToFormAppoint () {
      this.$router.push({ name: 'formAppoint' })
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
