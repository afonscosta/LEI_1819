import eventService from '../../services/eventService'

const state = {
  events: []
}

const getters = {
  events: state => {
    return state.events
  }
}

const mutations = {
  setEvents (state, events) {
    state.events = events
  },
  addEvent(state, event) {
    state.events.push(event)
  },
  deleteEvent(state, eventId) {
    state.events = state.events.filter(obj => obj.pk !== eventId)
  }
}

const actions = {
  getEvents ({ commit }) {
    eventService.fetchEvents()
    .then(events => {
      commit('setEvents', events)
    })
  },
  addEvent({ commit }, event) {
    eventService.postEvent(event)
    .then(() => {
      commit('addEvent', event)
    })
  },
  deleteEvent( { commit }, eventId) {
    eventService.deleteEvent(eventId)
    commit('deleteEvent', eventId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
