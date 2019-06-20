import usersService from '../../services/usersService'

const state = {
  backoffice: [],
  caregivers: [],
  patients: []
}

const mutations = {
  addCaregiver (state, user) {
    state.caregivers.push(user)
  },
  addPatient (state, user) {
    state.patients.push(user)
  },
  addBackoffice (state, user) {
    state.backoffice.push(user)
  }
}

const actions = {
  addCaregiver ({ commit }, caregiver) {
    return new Promise((resolve, reject) => {
      usersService.addCaregiver(caregiver)
        .then(newCaregiver => {
          commit('addCaregiver', newCaregiver)
        })
        .then(response => {
          resolve(response)
        }, error => {
          reject(error)
        })
    })
  },
  addPatient ({ commit }, patient) {
    return new Promise((resolve, reject) => {
      usersService.addPatient(patient)
        .then(newPatient => {
          commit('addPatient', newPatient)
        })
        .then(response => {
          resolve(response)
        }, error => {
          reject(error)
        })
    })
  },
  addBackoffice ({ commit }, backoffice) {
    return new Promise((resolve, reject) => {
      usersService.addBackoffice(backoffice)
        .then(newBackoffice => {
          commit('addBackoffice', newBackoffice)
        })
        .then(response => {
          resolve(response)
        }, error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
