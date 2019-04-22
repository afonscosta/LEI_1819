import calendarsService from '../../services/calendarsService'

const state = {
  calendars: Array
}

const getters = {
  calendars: state => {
    return state.calendars
  },
  calendarAppoint: state => {
    return state.calendars.find(calendar => calendar.pk === '1')
  },
  calendarMedication: state => {
    return state.calendars.find(calendar => calendar.pk === '2')
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
