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
            v-if="(usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0) && prescriptions.length !== 0"
            @click="goToFormPrescription">Adicionar Prescrição</b-button>
        </b-col>
      </b-row>
    </b-container>
    <ListPrescriptions 
      v-if="!prescriptionSel"
      @editPrescription="editPrescription"
    ></ListPrescriptions>
    <FormPrescription 
      v-if="prescriptionSel"
      :formData="form"
      :prescriptionData="prescription"
      @prescriptionUpdated="prescriptionUpdated"
      @hide="prescriptionSel = null"
    ></FormPrescription>
  </div>
</template>

<script>
import ListPrescriptions from './ListPrescriptions'
import FormPrescription from './FormPrescription'
import { mapState } from 'vuex'
import { DateTime as LuxonDateTime } from 'luxon'

export default {
  name: 'Prescriptions',
  components: {
    ListPrescriptions,
    FormPrescription
  },
  props: {
  },
  data: () => ({
    prescriptionSel: null,
    form: {},
    prescription: {}
  }),
  created () {
  },
  computed: {
    ...mapState({
      prescriptions: state => state.prescriptions.prescriptions,
      usersActive: state => state.users.usersActive
    })
  },
  methods: {
    parseScheduleOption (presc) {
      var rec = null
      if (presc.event.schedule.duration === 1 &&
      presc.event.schedule.durationInDays === 0 &&
      presc.event.schedule.durationUnit === 'days' &&
      !presc.event.schedule.times &&
      !presc.event.schedule.dayOfWeek &&
      !presc.event.schedule.dayOfMonth &&
      !presc.event.schedule.month &&
      !presc.event.schedule.year) {
        rec = 'daily'
      } else if (!presc.event.schedule.duration &&
      !presc.event.schedule.durationInDays &&
      !presc.event.schedule.durationUnit &&
      !presc.event.schedule.times &&
      presc.event.schedule.dayOfWeek &&
      !presc.event.schedule.dayOfMonth &&
      !presc.event.schedule.month &&
      !presc.event.schedule.year) {
        rec = 'weekly'
      } else if (!presc.event.schedule.duration &&
      !presc.event.schedule.durationInDays &&
      !presc.event.schedule.durationUnit &&
      !presc.event.schedule.times &&
      !presc.event.schedule.dayOfWeek &&
      presc.event.schedule.dayOfMonth &&
      !presc.event.schedule.month &&
      !presc.event.schedule.year) {
        rec = 'monthly'
      } else if (!presc.event.schedule.duration &&
      !presc.event.schedule.durationInDays &&
      !presc.event.schedule.durationUnit &&
      !presc.event.schedule.times &&
      !presc.event.schedule.dayOfWeek &&
      presc.event.schedule.dayOfMonth &&
      presc.event.schedule.month &&
      !presc.event.schedule.year) {
        rec = 'yearly'
      }
      return rec
    },
    editPrescription (presc) {
      this.prescriptionSel = presc.prescrition.pk
      var time = ''
      if (presc.event.schedule.times) {
        var timeSplit = presc.event.schedule.times[0].split(':')
        time = LuxonDateTime.fromObject({
          hour: timeSplit[0],
          minute: timeSplit[1],
          second: timeSplit[2]
        }).toISO()
      }
      var form = {
        dateValue: new Date(
          presc.occurrenceDate.year,
          presc.occurrenceDate.month - 1,
          presc.occurrenceDate.dayOfMonth + 1
        ).toISOString(),
        timeValue: time,
        allDay: !presc.event.schedule.times,
        duration: presc.event.schedule.duration ? presc.event.schedule.duration : 0,
        durationUnit: presc.event.schedule.durationUnit ? presc.event.schedule.durationUnit : '',
        local: presc.event.data.location,
        description: presc.event.data.description,
        notify: presc.event.data.notify,
        sched: this.parseScheduleOption(presc),
        id: presc.event.id
      }
      this.form = form
      this.prescrition = presc.prescription
    },
    prescriptionUpdated (occurrenceDate) {
      this.prescriptionSel = null
      this.$notify({
        title: 'A consulta foi atualizada com sucesso.',
        duration: 3000
      })
    },
    goToFormPrescription () {
      this.$router.push({ name: 'formPrescription' })
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
