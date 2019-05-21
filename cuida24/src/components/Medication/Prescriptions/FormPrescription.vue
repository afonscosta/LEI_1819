<template>
  <div>
    <notifications 
      position="top center"
      classes="notif"
      :speed="500"
      :width="450"
      animation-name="v-fade-top"
    />

    <div v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">
      <h3>Não foi selecionado nenhum utilizador.</h3>
      <h3>Carregue <router-link :to="{ name: 'medication' }">aqui</router-link> para escolher um.</h3>
    </div>

    <b-modal 
      ref="modal-med"
      hide-footer centered
      title="Medicamentos disponíveis"
      size="lg"
    >
      <b-container>
        <b-row>
          <b-col>
            <h5><b>Medicamentos</b></h5>
            <ListMedicines 
              :meds="medicines"
              :selected="medicine"
              @removeSelected="removeMedicine"
              @updateSelected="updateMedicine"
            ></ListMedicines>
          </b-col>
        </b-row>
      </b-container>
      <b-button class="mt-2" variant="success" block @click="confirme(false)">Cancelar</b-button>
      <b-button class="mt-3" variant="danger" block @click="confirme(true)">Guardar</b-button>
    </b-modal>

    <b-container v-if="usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0">
      <b-row>
        <b-col md="6" sm="12">
          <b-card bg-variant="light">
            <b-form align="left">

              <b-button block class="mb-3" @click="$refs['modal-med'].show()">Escolher medicamento</b-button>

              <b-form-group
                id="input-group-1"
                label="Dose (ml/mg)"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="prescription.quantity"
                  type="number"
                  required
                  placeholder="Introduza a quantidade"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-2"
                label="Via de administração"
                label-for="input-2"
              >
                <b-form-input
                  id="input-2"
                  v-model="form.description"
                  required
                  placeholder="Insira a via de administração do medicamento"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-2"
                label="Data"
                label-for="input-2"
              >
                <datetime 
                  id="input-2"
                  class="form-control"
                  type="date" 
                  v-model="form.dateValue"
                  :phrases="datetime.phrases"
                  :week-start="datetime['week-start']"
                  :min-datetime="datetime.minDatetime"
                ></datetime>
              </b-form-group>

              <b-form-group
                id="input-group-3"
                label="Repetição"
                label-for="input-3"
              >
                <b-form-select
                  v-model="selectedSchedule"
                  :options="optionsSchedule"
                ></b-form-select>
              </b-form-group>
                
              <b-form-group
                id="input-group-4"
                label="Hora"
                label-for="input-4"
              >
                <datetime 
                  class="form-control"
                  type="time"
                  v-model="form.timeValue"
                  @close="updateNotify"
                ></datetime>
              </b-form-group>

              <b-form-group id="input-group-6" label="Notificações" label-for="input-6">
                <notification
                  :notify="form.notify"
                ></notification>
              </b-form-group>
            </b-form>

            <b-row>
              <b-col>
                <b-button block variant="primary" v-if="form.id === null" @click="$router.go(-1)">Cancelar</b-button>
                <b-button block variant="primary" v-if="form.id !== null" @click="$emit('hide')">Cancelar</b-button>
              </b-col>
              <b-col>
                <b-button block variant="success" @click="onSubmit">Submeter</b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col md="6" sm="12">
          <calReadOnly></calReadOnly>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { DateTime as LuxonDateTime } from 'luxon'
import { mapActions, mapState, mapGetters } from 'vuex'
import { format, parse, subMinutes } from 'date-fns'
import notification from '@/components/Notification.vue'
import schedule from '@/components/Schedule'
import calReadOnly from '@/components/Calendar/CalendarReadOnly'
import ListMedicines from '../ListMedicines'

export default {
  name: 'FormPrescription',
  components: {
    notification,
    schedule,
    calReadOnly,
    ListMedicines
  },
  props: {
    formData: {
      dateValue: {
        default: '',
        type: String
      },
      timeValue: {
        default: '',
        type: String
      },
      allDay: {
        default: false,
        type: Boolean
      },
      duration: {
        default: 5,
        type: Number
      },
      durationUnit: {
        default: 'minutes',
        type: String
      },
      local: {
        default: '',
        type: String
      },
      description: {
        default: '',
        type: String
      },
      notify: {
        default: [],
        type: Array
      },
      sched: {
        default: null,
        type: Object
      },
      id: {
        default: null,
        type: Number
      }
    },
    prescriptionDate: {
      pk: {
        default: null,
        type: Number
      },
      quantity: {
        default: null,
        type: Number
      },
      medicine: {
        default: null,
        type: Number
      },
      state: {
        default: null,
        type: String
      },
      author: {
        default: null,
        type: String
      },
      date: {
        default: null,
        type: String
      }
    }
  },
  data: () => ({
    datetime: {
      phrases: {ok: 'Ok', cancel: 'Cancelar'},
      minDatetime: LuxonDateTime.local().toISO(),
      'week-start': 7
    },
    durations: [
      { text: 'minuto', value: 'minutes' },
      { text: 'hora', value: 'hours' },
      { text: 'dia', value: 'days' },
      { text: 'semana', value: 'weeks' },
      { text: 'mês', value: 'months' }
    ],
    show: true,
    selectedSchedule: 'none',
    optionsSchedule: [
      { value: 'none', text: 'Não se repete' },
      { value: 'daily', text: 'Todos os dias' },
      { value: 'weekly', text: 'Semanalmente' },
      { value: 'monthly', text: 'Mensalmente' },
      { value: 'annually', text: 'Anualmente' }
    ],
    prescription: {
      quantity: null,
      state: 'E',
      medicine: null,
      author: null,
      date: null,
      pk: null
    },
    form: {
      dateValue: '',
      timeValue: '',
      allDay: false,
      duration: 5,
      durationUnit: 'minutes',
      local: '',
      description: '',
      notify: [],
      sched: null,
      id: null
    },
    medicine: []
  }),
  created () {
    this.$store.dispatch('medicines/getMedicines')
    if (this.formData) {
      this.form = this.formData
    }
  },
  computed: {
    ...mapState({
      usersActive: state => state.users.usersActive,
      medicines: state => state.medicines.medicines
    }),
    ...mapGetters('calendars', ['calendarMedication']),
    scheduleChosen () {
      return this.parseScheduleOption(this.selectedSchedule)
    }
  },
  methods: {
    ...mapActions('prescriptions', ['addPrescription', 'updatePrescription', 'deletePrescription']),
    parseScheduleOption (option) {
      let result = {}
      let dt = LuxonDateTime.fromISO(this.form.dateValue)
      // let wsom = this.weekSpanOfMonth(dt)
      let dow = dt.weekday % 7
      dt.c.month = dt.c.month - 1
      switch (option) {
        case 'daily':
          result = {
            'duration': 1,
            'durationInDays': 0,
            'durationUnit': 'days'
          }
          break
        case 'weekly':
          result = {
            'dayOfWeek': [dow]
          }
          break
        case 'monthly':
          result = {
            'dayOfMonth': [dt.c.day]
          }
          break
        case 'annually':
          result = {
            'dayOfMonth': [dt.c.day],
            'month': [dt.c.month]
          }
          break
        default:
          result = {
            'dayOfMonth': [dt.c.day],
            'month': [dt.c.month],
            'year': [dt.c.year]
          }
      }
      return result
    },
    onSubmit () {
      const users = {
        'caregivers': this.usersActive.caregivers,
        'patients': this.usersActive.patients
      }
      let data = {
        'calendar': this.calendarMedication.pk,
        'color': this.calendarMedication.color,
        'description': this.form.description,
        'forecolor': this.calendarMedication.forecolor,
        'location': this.form.local,
        'notify': this.form.notify,
        'title': 'Medicação'
      }
      this.form.sched = this.scheduleChosen
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
      let dt = LuxonDateTime.fromISO(this.form.dateValue)
      let payload = {
        'event': {
          'data': data,
          'schedule': this.form.sched,
          'id': this.form.id
        },
        'users': users,
        'occurrenceDate': {
          'dayOfMonth': dt.c.day,
          'month': dt.c.month,
          'year': dt.c.year
        },
        'prescription': this.preparePrescription()
      }
      if (payload.event.id) {
        this.updatePrescription(payload)
        this.$emit('prescriptionUpdated', payload.occurrenceDate)
      } else {
        this.addPrescription(payload)
        this.$notify({
          title: 'A prescrição foi adicionada com sucesso.',
          duration: 3000
        })
        this.prescription = {
          quantity: null,
          state: 'E',
          medicine: null,
          author: null,
          date: null,
          pk: null
        }
        this.form = {
          dateValue: '',
          timeValue: '',
          allDay: false,
          duration: 5,
          durationUnit: 'minutes',
          local: '',
          description: '',
          notify: [],
          sched: null,
          id: null
        }
        this.medicine = []
        this.selectedSchedule = 'none'
      }
    },
    preparePrescription () {
      var payload = this.prescription
      payload.medicine = this.prescription.medicine[0].pk
      return payload
    },
    updateNotify () {
      if (this.form.dateValue) {
        var d = parse(this.form.dateValue)
        var t = LuxonDateTime.fromISO(this.form.timeValue)
        t = t.minus({ minutes: 10 })
        t = t.minus({ hours: 1 })
        const formattedTime = 'T' + ('0' + t.hour).slice(-2) + ':' + ('0' + t.minute).slice(-2) + ':' + ('0' + t.second).slice(-2) + '.000Z'
        var prev10Min = format(subMinutes(d, 10), 'YYYY-MM-DD') + formattedTime
        this.form.notify = [prev10Min]
      } else {
        this.form.notify = []
      }
    },
    removeMedicine () {
      this.medicine = []
    },
    updateMedicine (med) {
      this.medicine = [med]
    },
    confirme (save) {
      if (save) {
        this.prescription.medicine = this.medicine.length === 1 ? this.medicine : []
      } else {
        this.medicine = this.prescription.medicine
      }
      this.$refs['modal-med'].hide()
      console.log(this.prescription.medicine)
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

.vdatetime-input {
  width: 100%;
}

[type=number] {
  width: 100%;
}
</style>
