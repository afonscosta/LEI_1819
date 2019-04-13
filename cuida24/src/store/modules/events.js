import eventService from '../../services/eventService'
import { Calendar } from 'dayspan'

const state = {
  calendar: Calendar.months(undefined, undefined, undefined, {
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
    let cal = Calendar.months(undefined, undefined, undefined, {
      fill: true,
      updateRows: true
    })
    cal.addEvents(events)
    state.calendar = cal
  },
  addEvent (state, event) {
    let cal = Calendar.fromInput(state.calendar)
    cal.addEvent(event)
    state.calendar = cal
  },
  updateEvent (state, event) {
    let cal = Calendar.fromInput(state.calendar)
    let oldEvent = cal.findEvent(event.id)
    cal.removeEvent(oldEvent)
    cal.addEvent(event)
    state.calendar = cal
  },
  deleteEvent (state, eventId) {
    let cal = Calendar.fromInput(state.calendar)
    let oldEvent = cal.findEvent(eventId)
    cal.removeEvent(oldEvent)
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
  addEvent ({ commit }, event) {
    eventService.postEvent(event)
      .then(newEvent => {
        commit('addEvent', event)
      })
  },
  updateEvent ({ commit }, event) {
    eventService.postEvent(event)
      .then(() => {
        commit('updateEvent', event)
      })
  },
  deleteEvent ({ commit }, event) {
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
