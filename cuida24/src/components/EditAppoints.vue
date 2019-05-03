<template>
  <div>
    <b-container>
      <b-row class="justify-content-md-center">
        <b-col md="6">
          <b-alert
            :show="dismissCountDown"
            dismissible
            variant="success"
            @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged"
          >
            <p>A consulta foi atualizada com sucesso.</p>
            <b-progress
              variant="success"
              :max="dismissSecs"
              :value="dismissCountDown"
              height="4px"
            ></b-progress>
          </b-alert>
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
      @eventUpdated="eventUpdated"
    ></formAppoint>
  </div>
</template>

<script>
import listAppoints from './ListAppoints'
import formAppoint from './FormAppoint'
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
    form: {},
    dismissSecs: 3,
    dismissCountDown: 0
  }),
  created () {
  },
  computed: {
  },
  methods: {
    log (info) {
      console.log(info)
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
    editAppointment (appt) {
      console.log('appt', appt)
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
      console.log('form', this.form)
      // this.$emit('editAppointment', form)
    },
    countDownChanged  (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    eventUpdated (occurrenceDate) {
      this.appointmentSel = null
      this.dismissCountDown = this.dismissSecs
    }
  }
}
</script>
