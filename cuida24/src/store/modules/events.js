import { Calendar, Schedule, Event } from 'dayspan'
import eventsService from '@/services/eventsService'

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
    var newEvents = events.map(function (ev) {
      return new Event(
        new Schedule(ev['event']['schedule']),
        ev['event']['data'],
        ev['event']['id'],
        true
      )
    })
    cal.addEvents(newEvents)
    state.calendar = cal
  },
  addEvents (state, events) {
    var newEvents = events.map(function (ev) {
      return new Event(
        new Schedule(ev['event']['schedule']),
        ev['event']['data'],
        ev['event']['id'],
        true
      )
    })
    let cal = Calendar.fromInput(state.calendar)
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
    event['visible'] = true
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
  setEvents ({ commit }, events) {
    commit('setEvents', events)
  },
  addEvents ({ commit }, events) {
    commit('addEvents', events)
  },
  addEvent ({ commit }, event) {
    console.log('Novo evento enviado pelo vue', event)
    commit('addEvent', event)
  },
  updateEvent ({ commit }, event) {
    commit('updateEvent', event)
  },
  deleteEvent ({ commit }, eventID) {
    commit('deleteEvent', eventID)
  },
  getEvents ({ commit }, payload) {
    eventsService.fetchEvents(payload)
      .then(events => {
        console.log('sessions/appointments recebidas do django', events)
        commit('setEvents', [])
        events.appointments.forEach(appts => {
          this.dispatch('appointments/setAppointments', appts)
        })
        this.dispatch('sessions/setSessions', events.sessions[0])
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
