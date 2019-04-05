import Vue from 'vue'
import Vuex from 'vuex'
import messages from './modules/messages'
import events from './modules/events'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    messages,
    events
  }
})
