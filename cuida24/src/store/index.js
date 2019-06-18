import Vue from 'vue'
import Vuex from 'vuex'
import messages from './modules/messages'
import events from './modules/events'
import users from './modules/users'
import calendars from './modules/calendars'
import appointments from './modules/appointments'
import notes from './modules/notes'
import sessions from './modules/sessions'
import evaluations from './modules/evaluations'
import prescriptions from './modules/prescriptions'
import medicines from './modules/medicines'
import habits from './modules/habits'
import login from './modules/login'
import register from './modules/register'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    messages,
    events,
    calendars,
    users,
    appointments,
    notes,
    sessions,
    login,
    register,
    evaluations,
    prescriptions,
    medicines,
    habits
  }
})
