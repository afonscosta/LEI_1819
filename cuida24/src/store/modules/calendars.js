import calendarsService from '../../services/calendarsService'

const state = {
  calendars: []
}

const getters = {
  calendars: state => {
    return state.calendars
  },
  calendarAppoint: state => {
    return state.calendars.find(calendar => calendar.pk === 1)
  },
  calendarMedication: state => {
    return state.calendars.find(calendar => calendar.pk === 2)
  },
  calendarGroupSession: state => {
    return state.calendars.find(calendar => calendar.pk === 3)
  },
  calendarIndivSession: state => {
    return state.calendars.find(calendar => calendar.pk === 4)
  },
  calendarAppointPatient: state => {
    return state.calendars.find(calendar => calendar.pk === 5)
  }
}

const mutations = {
  setCalendars (state, calendars) {
    console.log('calendars', calendars)
    state.calendars = calendars
  }
}

const actions = {
  getCalendars ({ commit }) {
    calendarsService.fetchCalendars()
      .then(calendars => {
        commit('setCalendars', calendars)
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
