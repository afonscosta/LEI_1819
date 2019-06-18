import usersService from '../../services/usersService'

const state = {
  users: {
    caregivers: [],
    patients: [],
    backoffice: []
  },
  usersActive: {
    caregivers: [],
    patients: []
  },
  userAuth: {}
}

const getters = {
  getCaregiverByInfoId: (state) => (id) => {
    return state.users.caregivers.find(u => u.info.pk === id)
  },
  getPatientByInfoId: (state) => (id) => {
    return state.users.patients.find(u => u.info.pk === id)
  },
  getCaregiverById: (state) => (id) => {
    return state.users.caregivers.find(u => u.pk === id)
  },
  getPatientById: (state) => (id) => {
    return state.users.patients.find(u => u.pk === id)
  },
  getBackofficeUserById: (state) => (id) => {
    return state.users.backoffice.find(u => u.pk === id)
  },
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
  },
  backoffice: state => {
    return state.users.backoffice
  },
  userAuth: state => {
    return state.userAuth
  }
}

const mutations = {
  setCaregivers (state, caregivers) {
    state.users.caregivers = caregivers
  },
  setPatients (state, patients) {
    state.users.patients = patients
  },
  setBackoffice (state, backoffice) {
    state.users.backoffice = backoffice
  },
  setUserAuth (state, userAuth) {
    state.userAuth = userAuth
  }
}

const actions = {
  getUsers ({ commit }) {
    usersService.fetchCaregivers()
      .then(caregivers => {
        console.log('caregivers', caregivers)
        commit('setCaregivers', caregivers)
      })
    usersService.fetchPatients()
      .then(patients => {
        console.log('patients', patients)
        commit('setPatients', patients)
      })
    usersService.fetchBackoffice()
      .then(backoffice => {
        console.log('backoffice', backoffice)
        commit('setBackoffice', backoffice)
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
  },
  getBackoffice ({ commit }) {
    usersService.fetchBackoffice()
      .then(backoffice => {
        console.log('backoffice', backoffice)
        commit('setBackoffice', backoffice)
      })
  },
  getUserAuth ({ commit }) {
    usersService.fetchUserAuth()
      .then(user => {
        console.log('get userAuth', user)
        commit('setUserAuth', user)
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
