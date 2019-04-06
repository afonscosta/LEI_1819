import eventService from '../../services/eventService'
import { Calendar } from 'dayspan';

const state = {
  calendar: Calendar.months(undefined,undefined,undefined,{
      fill: true,
      updateRows: true
    })
}

const getters = {
  calendar: state => {
    return state.calendar
  }
}

const mutations = {
  setEvents (state, events) {
    let cal = Calendar.months(undefined,undefined,undefined,{
      fill: true,
      updateRows: true
    })
    cal.addEvents(events)
    state.calendar = cal
  },
  addEvent(state, event) {
    let cal = Calendar.fromInput(state.calendar)
    cal.addEvent(event)
    state.calendar = cal
  },
  updateEvent(state, event) {
    let cal = Calendar.fromInput(state.calendar)
    let old_event = cal.findEvent(event.id)
    cal.removeEvent(old_event)
    cal.addEvent(event)
    state.calendar = cal
  },
  deleteEvent(state, eventId) {
    let cal = Calendar.fromInput(state.calendar)
    let old_event = cal.findEvent(eventId)
    cal.removeEvent(old_event)
    state.calendar = cal
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
    .then(new_event => {
      commit('addEvent', new_event)
    })
  },
  updateEvent({ commit }, event) {
    eventService.postEvent(event)
    .then(() => {
      commit('updateEvent', event)
    })
  },
  deleteEvent( { commit }, event) {
    eventService.deleteEvent(event.id)
    commit('deleteEvent', event.id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
