import usersService from '../../services/usersService'

const state = {
  backoffice: [],
  caregivers: [],
  patients: []
}

const mutations = {
  setCaregivers (state, caregivers) {
    state.caregivers = caregivers
  },
  setPatients (state, patients) {
    state.patients = patients
  },
  setBackoffice (state, backoffice) {
    state.backoffice = backoffice
  },
  addCaregiver (state, user) {
    state.caregivers.push(user)
  },
  addPatient (state, user) {
    state.patients.push(user)
  },
  addBackoffice (state, user) {
    state.backoffice.push(user)
  },
  deleteCaregiver (state, pk) {
    state.caregivers = state.caregivers.filter(n => n.pk !== pk)
  },
  deletePatient (state, pk) {
    state.patients = state.patients.filter(n => n.pk !== pk)
  },
  deleteBackoffice (state, pk) {
    state.backoffice = state.backoffice.filter(n => n.pk !== pk)
  }
}

const actions = {
  getCaregivers ({ commit }) {
    usersService.fetchCaregivers()
      .then(caregivers => {
        console.log(caregivers)
        commit('setCaregivers', caregivers)
      })
  },
  getPatients ({ commit }) {
    usersService.fetchPatients()
      .then(patients => {
        console.log(patients)
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
  },
  deleteCaregiver ({ commit }, pk) {
    return new Promise((resolve, reject) => {
      usersService.deleteCaregiver(pk)
        .then(() => {
          commit('deleteCaregiver', pk)
        })
        .then(response => {
          resolve(response)
        }, error => {
          reject(error)
        })
    })
  },
  deletePatient ({ commit }, pk) {
    return new Promise((resolve, reject) => {
      usersService.deletePatient(pk)
        .then(() => {
          commit('deletePatient', pk)
        })
        .then(response => {
          resolve(response)
        }, error => {
          reject(error)
        })
    })
  },
  deleteBackoffice ({ commit }, pk) {
    return new Promise((resolve, reject) => {
      usersService.deleteBackoffice(pk)
        .then(() => {
          commit('deleteBackoffice', pk)
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
