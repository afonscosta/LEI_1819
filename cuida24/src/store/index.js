import Vue from 'vue'
import Vuex from 'vuex'
import messages from './modules/messages'
import calendar from './modules/events'
import users from './modules/users'
import calendars from './modules/calendars'
import appointments from './modules/appointments.js'
import notes from './modules/notes.js'
import login from './modules/login'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    messages,
    calendar,
    calendars,
    users,
    appointments,
    notes,
    login
  }
})
