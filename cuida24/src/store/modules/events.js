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
  setEvents (state, {rootGetters, events}) {
    let cal = Calendar.months(undefined, undefined, undefined, {
      fill: true,
      updateRows: true
    })

    var newEvents = events.map(function (ev) {
      // eslint-disable-next-line
      var calendar = rootGetters['calendars/calendars'].find(cal => cal.pk == ev.event.data.calendar)
      ev.event.data.calendar = calendar.calendar
      return new Event(
        new Schedule(ev.event.schedule),
        ev.event.data,
        ev.event.id,
        true
      )
    })
    cal.addEvents(newEvents)
    state.calendar = cal
  },
  addEvents (state, {rootGetters, events}) {
    var newEvents = events.map(function (ev) {
      // eslint-disable-next-line
      var calendar = rootGetters['calendars/calendars'].find(cal => cal.pk == ev.event.data.calendar)
      ev.event.data.calendar = calendar.calendar
      return new Event(
        new Schedule(ev.event.schedule),
        ev.event.data,
        ev.event.id,
        true
      )
    })
    let cal = Calendar.fromInput(state.calendar)
    cal.addEvents(newEvents)
    state.calendar = cal
  },
  addEvent (state, {rootGetters, event}) {
    let sched = new Schedule(event.schedule)
    let cal = Calendar.fromInput(state.calendar)
    // eslint-disable-next-line
    var calendar = rootGetters['calendars/calendars'].find(cal => cal.pk == event.data.calendar)
    event.data.calendar = calendar.calendar
    let ev = new Event(sched, event.data, event.id, true)
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
  setEvents ({ rootGetters, commit }, events) {
    commit('setEvents', {rootGetters, events})
  },
  addEvents ({ rootGetters, commit }, events) {
    commit('addEvents', {rootGetters, events})
  },
  addEvent ({ rootGetters, commit }, event) {
    console.log('Novo evento enviado pelo vue', event)
    commit('addEvent', {rootGetters, event})
  },
  updateEvent ({ commit }, event) {
    commit('updateEvent', event)
  },
  deleteEvent ({ commit }, eventID) {
    commit('deleteEvent', eventID)
  },
  getEvents ({ rootGetters, commit }, payload) {
    eventsService.fetchEvents(payload)
      .then(events => {
        console.log('sessions/appointments recebidas do django', events)
        // commit('setEvents', {rootGetters, []})
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
