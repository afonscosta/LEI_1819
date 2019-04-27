import eventService from '../../services/eventService'
import { Calendar, Schedule, Event } from 'dayspan'

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
    console.log('events', events)
    let cal = Calendar.months(undefined, undefined, undefined, {
      fill: true,
      updateRows: true
    })
    var newEvents = events.map(function (ev) {
      return new Event(ev['event']['schedule'], ev['event']['data'], ev['event']['id'], true)
    })
    cal.addEvents(newEvents)
    state.calendar = cal
  },
  addEvent (state, event) {
    let sched = new Schedule(event['schedule'])
    let cal = Calendar.fromInput(state.calendar)
    let ev = new Event(sched, event['data'], event['id'], true)
    cal.addEvent(ev)
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
  getEvents ({ commit }, payload) {
    console.log('payload', payload)
    eventService.fetchEvents(payload)
      .then(events => {
        console.log('Resultado do fetch do vue', events)
        commit('setEvents', events)
      })
  },
  addEvent ({ commit }, payload) {
    eventService.postEvent(payload)
      .then(event => {
        console.log('Resultado recebido depois do post', event)
        commit('addEvent', event['event'])
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
