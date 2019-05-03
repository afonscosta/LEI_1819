import usersService from '../../services/usersService'

const state = {
  users: {
    caregivers: [],
    patients: []
  },
  usersActive: {
    caregivers: [],
    patients: []
  }
}

const getters = {
  users: state => {
    return state.users
  },
  usersActive: state => {
    return state.usersActive
  },
  caregivers: state => {
    return state.users.caregivers
  },
  patients: state => {
    return state.users.patients
  }
}

const mutations = {
  setCaregivers (state, caregivers) {
    state.users.caregivers = caregivers
  },
  setPatients (state, patients) {
    state.users.patients = patients
  }
}

const actions = {
  getUsers ({ commit }) {
    usersService.fetchCaregivers()
      .then(caregivers => {
        commit('setCaregivers', caregivers)
      })
    usersService.fetchPatients()
      .then(patients => {
        commit('setPatients', patients)
      })
  },
  getCaregivers ({ commit }) {
    usersService.fetchCaregivers()
      .then(caregivers => {
        commit('setCaregivers', caregivers)
      })
  },
  getPatients ({ commit }) {
    usersService.fetchPatients()
      .then(patients => {
        commit('setPatients', patients)
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
