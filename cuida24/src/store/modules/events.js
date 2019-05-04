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
  addEvent ({ commit }, event) {
    console.log('Novo evento enviado pelo vue', event)
    commit('addEvent', event)
  },
  updateEvent ({ commit }, event) {
    console.log('Evento enviado pelo vue para ser atualizado', event)
    commit('updateEvent', event)
  },
  deleteEvent ({ commit }, eventID) {
    commit('deleteEvent', eventID)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
