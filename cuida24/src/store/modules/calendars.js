import calendarsService from '../../services/calendarsService'

const state = {
  calendars: Array
}

const getters = {
  calendars: state => {
    return state.calendars
  },
  calendarAppoint: state => {
    return state.calendars.find(calendar => calendar.url === 'http://localhost:8000/cuida24/calendars/1/')
  },
  calendarMedication: state => {
    return state.calendars.find(calendar => calendar.url === 'http://localhost:8000/cuida24/calendars/2/')
  }
}

const mutations = {
  setCalendars (state, calendars) {
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
