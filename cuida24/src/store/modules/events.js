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
    let cal = Calendar.months(undefined, undefined, undefined, {
      fill: true,
      updateRows: true
    })
    var newEvents = events.map(function (ev) {
      let data = {
        'calendar': ev['calendar'],
        'color': '#1976d2',
        'description': ev['description'],
        'forecolor': '#ffffff',
        'location': ev['location'],
        'notify': [],
        'title': ev['title']
      }
      // TODO: acabar o schedule
      let newEv = new Event(new Schedule(), data, ev['pk'], ev['visible'])
      return newEv
    })
    cal.addEvents(newEvents)
    state.calendar = cal
  },
  addEvent (state, dictEvent) {
    let sched = new Schedule(dictEvent['event']['schedule'])
    let infoEvent = dictEvent['infoEvent']
    let cal = Calendar.fromInput(state.calendar)
    let data = {
      'calendar': infoEvent['calendar'],
      'color': '#1976d2',
      'description': infoEvent['description'],
      'forecolor': '#ffffff',
      'location': infoEvent['location'],
      'notify': [],
      'title': infoEvent['title']
    }
    let ev = new Event(sched, data, infoEvent['pk'], true)
    cal.removeEvent(event)
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
  getEvents ({ commit }) {
    eventService.fetchEvents()
      .then(events => {
        commit('setEvents', events)
      })
  },
  addEvent ({ commit }, payload) {
    eventService.postEvent(payload)
      .then(infoEvent => {
        commit('addEvent', {
          'event': payload['event'],
          'infoEvent': infoEvent
        })
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
