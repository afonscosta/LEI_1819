<template>
  <div>
    <div v-if="usersActive.caregivers.length === 0 && usersActive.patients.length === 0">
      <h3>Não foi selecionado nenhum utilizador.</h3>
      <h3>Carregue <router-link :to="{ name: 'calendar' }">aqui</router-link> para escolher um.</h3>
    </div>

    <b-container v-if="usersActive.caregivers.length !== 0 || usersActive.patients.length !== 0">
      <b-row class="mb-3">
        <b-col sm="12">
          <b-card v-if="session.comment !== null" title="Comentário associado ao pedido de revisão">
            <b-card-text>
              {{ session.comment }}
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
      <b-row sm="auto">
        <b-col md="6" sm="12">
          <b-card bg-variant="light">
            <b-form align="left" @submit.prevent="onSubmit">
              <b-form-group
                id="input-group-1"
                label="Tema"
                label-for="theme"
              >
                <b-form-input
                  id="theme"
                  v-model="session.theme"
                  required
                  placeholder="Introduza o tema da sessão de grupo"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-2"
                label="Data"
                label-for="theme"
              >
                <datetime 
                  class="form-control"
                  type="date" 
                  v-model="form.dateValue"
                  :phrases="datetime.phrases"
                  :week-start="datetime['week-start']"
                  :min-datetime="datetime.minDatetime"
                  @close="updateNotify"
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

              <b-form-checkbox-group
                class="mt-3 mb-3"
                v-model="form.allDay"
                id="checkboxes-3">
                <b-form-checkbox value="true">Dia inteiro</b-form-checkbox>
              </b-form-checkbox-group>

              <b-container 
                class="m-0 p-0"
                v-if="!form.allDay"
              >
                <b-row class="m-0 p-0">
                  <b-col cols="6" class="p-0 pr-3">
                    <b-form-group
                      id="input-group-4"
                      label="Hora"
                      label-for="input-4"
                    >
                      <datetime 
                        class="form-control"
                        type="time"
                        v-model="form.timeValue"
                      ></datetime>
                    </b-form-group>
                  </b-col>
                  <b-col cols="6" class="p-0">
                    <b-form-group
                      id="input-group-7"
                      label="Duração"
                      label-for="input-7"
                    >
                      <b-row>
                        <b-col cols="4" class="pr-1">
                          <b-form-input
                            width="100%"
                            id="input-7"
                            v-model="form.duration"
                            required
                            placeholder="Introduza uma duração"
                          ></b-form-input>
                        </b-col>
                        <b-col cols="8" class="pl-0">
                          <b-form-select
                            width="100%"
                            id="input-8"
                            v-model="form.durationUnit"
                            :options="durations"
                            required
                          ></b-form-select>
                        </b-col>
                      </b-row>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-container>
              
              <b-form-group id="input-group-5" label="Localização" label-for="input-5">
                <b-form-input
                  id="input-5"
                  v-model="form.local"
                  required
                  placeholder="Introduza localização"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-6"
                label="Notificações"
                label-for="input-6"
              >
                <notification
                  :notify="form.notify"
                ></notification>
              </b-form-group>

              <b-form-group
                id="input-group-6"
                label="Descrição"
                label-for="input-6"
              >
                <b-form-textarea
                  id="description"
                  v-model="session.description"
                  required
                  rows="3"
                  max-rows="6"
                  placeholder="Insira a descrição da sessão de grupo aqui"
                ></b-form-textarea>
              </b-form-group>

              <b-form-group
                id="input-group-7"
                label="Objetivos"
                label-for="input-7"
              >
                <b-row v-for="(g,idx) in session.goals" :key="g" align-v="center" align-h="between">
                  <b-col cols="10" class="pr-0">
                    <p class="form-control m-0 mb-1">{{ g }}</p>
                  </b-col>
                  <b-col cols="2" class="pr-0">
                    <b-button class="p-0 ml-2" variant="danger" @click="removeGoal(idx)"><v-icon>delete</v-icon></b-button>
                  </b-col>
                </b-row>
                <b-row align-v="center" align-h="between">
                  <b-col cols="10" class="pr-0">
                    <b-form-input
                      id="goal"
                      v-model="goal"
                      placeholder="Adicione um objetivo..."
                      v-on:keydown.enter.prevent="addToGoals"
                    ></b-form-input>
                  </b-col>
                  <b-col cols="2" align-self="center" class="pr-0">
                    <b-button class="p-0 ml-2" variant="light" @click="addToGoals"><v-icon>add_circle</v-icon></b-button>
                  </b-col>
                </b-row>
              </b-form-group>

              <b-form-group
                id="input-group-8"
                label="Material necessário"
                label-for="input-8"
              >
                <b-row v-for="(m,idx) in session.materials" :key="m" align-v="center" align-h="between">
                  <b-col cols="10" class="pr-0">
                    <p class="form-control m-0 mb-1">{{ m }}</p>
                  </b-col>
                  <b-col cols="2" class="pr-0">
                    <b-button class="p-0 ml-2" variant="danger" @click="removeMaterial(idx)"><v-icon>delete</v-icon></b-button>
                  </b-col>
                </b-row>
                <b-row align-v="center" align-h="between">
                  <b-col cols="10" class="pr-0">
                    <b-form-input
                      id="item"
                      v-model="item"
                      placeholder="Adicione um item..."
                      v-on:keydown.enter.prevent="addToMaterials"
                    ></b-form-input>
                  </b-col>
                  <b-col cols="2" align-self="center" class="pr-0">
                    <b-button class="p-0 ml-2" variant="light" @click="addToMaterials"><v-icon>add_circle</v-icon></b-button>
                  </b-col>
                </b-row>
              </b-form-group>

              <b-row>
                <b-col>
                  <b-button block variant="primary" v-if="form.id === null" @click="$router.go(-1)">Cancelar</b-button>
                  <b-button block variant="primary" v-if="form.id !== null" @click="hide">Cancelar</b-button>
                </b-col>
                <b-col>
                  <b-button block type="submit" variant="success">Submeter</b-button>
                </b-col>
              </b-row>
            </b-form>
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
import { mapActions, mapGetters, mapState } from 'vuex'
import { DateTime as LuxonDateTime } from 'luxon'
import notification from '@/components/Notification.vue'
import schedule from '@/components/Schedule'
import calReadOnly from '@/components/Calendar/CalendarReadOnly'
import { format, parse, subDays, subMonths } from 'date-fns'

export default {
  name: 'formSession',
  components: {
    notification,
    schedule,
    calReadOnly
  },
  props: {
    isGroupSession: {
      default: false,
      type: Boolean
    },
    isIndivSession: {
      default: false,
      type: Boolean
    },
    sessionData: {
      default: null,
      type: Object
    },
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
        default: true,
        type: Boolean
      },
      duration: {
        default: 0,
        type: Number
      },
      durationUnit: {
        default: '',
        type: String
      },
      local: {
        default: '',
        type: String
      },
      notify: {
        default: [],
        type: Array
      },
      sched: {
        default: {},
        type: Object
      },
      users: {
        type: Object
      },
      id: {
        default: null,
        type: Number
      }
    }
  },
  data: () => ({
    session: {
      theme: '',
      description: '',
      goals: [],
      materials: [],
      state: 'E',
      comment: null,
      pk: null
    },
    form: {
      dateValue: '',
      timeValue: '',
      allDay: true,
      duration: 0,
      durationUnit: '',
      local: '',
      notify: [],
      sched: null,
      users: {},
      id: null
    },
    selectedSchedule: 'none',
    optionsSchedule: [
      { value: 'none', text: 'Não se repete' },
      { value: 'daily', text: 'Todos os dias' },
      { value: 'weekly', text: 'Semanalmente' },
      { value: 'monthly', text: 'Mensalmente' },
      { value: 'annually', text: 'Anualmente' }
    ],
    item: '',
    goal: '',
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
    ]
  }),
  created () {
    if (this.sessionData) {
      this.session = this.sessionData
      this.form = this.formData
    }
  },
  computed: {
    ...mapState({
      usersActive: state => state.users.usersActive,
      caregivers: state => state.users.users.caregivers,
      patients: state => state.users.users.patients
    }),
    ...mapGetters('calendars', [
      'calendarGroupSession',
      'calendarIndivSession'
    ]),
    ...mapGetters('users', [
      'getCaregiverById',
      'getPatientById'
    ]),
    scheduleChosen () {
      return this.parseScheduleOption(this.selectedSchedule)
    }
  },
  methods: {
    ...mapActions('sessions', [
      'addGroupSession',
      'updateGroupSession',
      'deleteGroupSession',
      'addIndivSession',
      'updateIndivSession',
      'deleteIndivSession'
    ]),
    addToMaterials () {
      this.session.materials.push(this.item)
      this.item = ''
    },
    addToGoals () {
      this.session.goals.push(this.goal)
      this.goal = ''
    },
    onSubmit (evt) {
      let eventData = this.prepareEvent()
      let payload = {}
      if (
        this.isIndivSession ||
        (
          !this.isGroupSession &&
          !this.isIndivSession &&
          (this.usersActive.caregivers.length + this.usersActive.patients.length) === 1
        )
      ) {
        payload = {
          'individualSession': this.session,
          'event': eventData
        }
        payload.event.data.calendar = this.calendarIndivSession.pk
        payload.event.data.color = this.calendarIndivSession.color
        payload.event.data.forecolor = this.calendarIndivSession.forecolor
        payload.event.data.title = 'Sessão Individual'
      } else {
        payload = {
          'groupSession': this.session,
          'event': eventData
        }
      }
      // If has id and state equals 'R' then is revision
      if (payload.groupSession && payload.event.id && payload.groupSession.state === 'R') {
        payload.groupSession.state = 'E'
        this.updateGroupSession(payload)
        this.$notify({
          title: 'A sessão de grupo revista foi atualizada com sucesso.',
          duration: 3000
        })
        this.$emit('groupSessionUpdated')
      } else if (payload.individualSession && payload.event.id && payload.individualSession.state === 'R') {
        payload.individualSession.state = 'E'
        this.updateIndivSession(payload)
        this.$notify({
          title: 'A sessão individual revista foi atualizada com sucesso.',
          duration: 3000
        })
        this.$emit('indivSessionUpdated')
      } else if (payload.groupSession && payload.event.id) { // If has id then is a simple update
        this.updateGroupSession(payload)
        this.$notify({
          title: 'A sessão de grupo foi atualizada com sucesso.',
          duration: 3000
        })
        this.$emit('groupSessionUpdated')
      } else if (payload.individualSession && payload.event.id) {
        this.updateIndivSession(payload)
        this.$notify({
          title: 'A sessão individual foi atualizada com sucesso.',
          duration: 3000
        })
        this.$emit('indivSessionUpdated')
      } else if (payload.groupSession) { // If doesn't have id then is a new session
        this.addGroupSession(payload)
        this.$notify({
          title: 'A sessão de grupo foi adicionada com sucesso.',
          duration: 3000
        })
      } else if (payload.individualSession) {
        this.addIndivSession(payload)
        this.$notify({
          title: 'A sessão individual foi adicionada com sucesso.',
          duration: 3000
        })
      }
      this.session = {
        theme: '',
        description: '',
        goals: [],
        materials: [],
        state: 'E',
        comment: null,
        pk: null
      }
      this.form = {
        dateValue: '',
        timeValue: '',
        allDay: true,
        duration: 0,
        durationUnit: '',
        local: '',
        specialty: '',
        notify: [],
        sched: null,
        users: {},
        id: null
      }
    },
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
    prepareEvent () {
      let users = {}
      if (this.form.id !== null) {
        users = this.form.users
      } else {
        users = {
          'caregivers': this.usersActive.caregivers,
          'patients': this.usersActive.patients
        }
      }
      let data = {
        'calendar': this.calendarGroupSession.pk,
        'color': this.calendarGroupSession.color,
        'description': this.session.theme + ' - ' + this.session.description,
        'forecolor': this.calendarGroupSession.forecolor,
        'location': this.form.local,
        'notify': this.form.notify,
        'title': 'Sessão de Grupo'
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
        'data': data,
        'schedule': this.form.sched,
        'id': this.form.id,
        'users': users,
        'occurrenceDate': {
          'dayOfMonth': dt.c.day,
          'month': dt.c.month,
          'year': dt.c.year
        }
      }
      return payload
    },
    updateNotify () {
      if (this.form.dateValue) {
        var d = parse(this.form.dateValue)
        var prevMonth = format(subMonths(d, 1), 'YYYY-MM-DD') + 'T09:00:00.000Z'
        var prev3Days = format(subDays(d, 3), 'YYYY-MM-DD') + 'T09:00:00.000Z'
        this.form.notify = [prevMonth, prev3Days]
      } else {
        this.form.notify = []
      }
    },
    isCaregiver (id) {
      if (this.caregivers.find(u => u.info.pk === id)) {
        return true
      }
      return false
    },
    isPatient (id) {
      if (this.patients.find(u => u.info.pk === id)) {
        return true
      }
      return false
    },
    hide () {
      this.$emit('hide')
    },
    removeGoal (index) {
      this.session.goals.splice(index, 1)
    },
    removeMaterial (index) {
      this.session.materials.splice(index, 1)
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
