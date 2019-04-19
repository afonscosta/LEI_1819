import Vue from 'vue'
import Vuex from 'vuex'
import messages from './modules/messages'
import calendar from './modules/events'
import users from './modules/users'
import calendars from './modules/calendars'
import login from './modules/login'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    messages,
    calendar,
    calendars,
    users,
    login
  }
})
