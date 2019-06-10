import evaluationsService from '../../services/evaluationsService'

const state = {
  session: null,
  caregiversEvaluations: [],
  patientsEvaluations: []
}

const getters = {
  session: state => {
    return state.session
  },
  caregiversEvaluations: state => {
    return state.caregiversEvaluations
  },
  patientsEvaluations: state => {
    return state.patientsEvaluations
  },
  getCaregiversInfo (state, getters, rootState, rootGetters) {
    let users = []
    if (state.session) {
      users.push(...state.session.event.users.caregivers.map(pk => rootGetters['users/getCaregiverById'](pk)))
    }
    return users
  },
  getPatientsInfo (state, getters, rootState, rootGetters) {
    let users = []
    if (state.session) {
      users.push(...state.session.event.users.patients.map(pk => rootGetters['users/getPatientById'](pk)))
    }
    return users
  }
}

const mutations = {
  setSession (state, s) {
    state.session = s
  },
  setEvaluations (state, es) {
    state.caregiversEvaluations = es.filter(e => e.hasOwnProperty('caregiverPK'))
    state.patientsEvaluations = es.filter(e => e.hasOwnProperty('patientPK'))
  },
  addCaregiverEvaluation (state, e) {
    state.caregiversEvaluations.push(e)
  },
  addPatientEvaluation (state, e) {
    state.patientsEvaluations.push(e)
  },
  updateCaregiverEvaluation (state, newE) {
    state.caregiversEvaluations = state.caregiversEvaluations.filter(e => e.pk !== newE.pk)
    state.caregiversEvaluations.push(newE)
  },
  updatePatientEvaluation (state, newE) {
    state.patientsEvaluations = state.patientsEvaluations.filter(e => e.pk !== newE.pk)
    state.patientsEvaluations.push(newE)
  },
  deleteCaregiverEvaluation (state, ePK) {
    state.caregiversEvaluations = state.caregiversEvaluations.filter(e => e.pk !== ePK)
  },
  deletePatientEvaluation (state, ePK) {
    state.patientsEvaluations = state.patientsEvaluations.filter(e => e.pk !== ePK)
  }
}

const actions = {
  setSession ({ commit }, s) {
    console.log('set session', s)
    commit('setSession', s)
  },
  getEvaluations ({ commit }, payload) {
    evaluationsService.fetchEvaluations(payload)
      .then(es => {
        console.log('evaluations recebidas do django', es)
        commit('setEvaluations', es)
      })
  },
  addCaregiverEvaluation ({ commit }, e) {
    return new Promise((resolve, reject) => {
      console.log('adding evaluation', e)
      evaluationsService.postEvaluation(e)
        .then(newE => {
          commit('addCaregiverEvaluation', newE)
        })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  addPatientEvaluation ({ commit }, e) {
    return new Promise((resolve, reject) => {
      console.log('adding evaluation', e)
      evaluationsService.postEvaluation(e)
        .then(newE => {
          commit('addPatientEvaluation', newE)
        })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  updateCaregiverEvaluation ({ commit }, e) {
    return new Promise((resolve, reject) => {
      console.log('updating evaluation', e)
      evaluationsService.putEvaluation(e)
        .then(() => {
          commit('updateCaregiverEvaluation', e)
        })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  updatePatientEvaluation ({ commit }, e) {
    return new Promise((resolve, reject) => {
      console.log('updating evaluation', e)
      evaluationsService.putEvaluation(e)
        .then(() => {
          commit('updatePatientEvaluation', e)
        })
        .then(response => {
          resolve(response)
        }, error => {
          reject(error)
        })
    })
  },
  deleteCaregiverEvaluation ({ commit }, ePK) {
    return new Promise((resolve, reject) => {
      console.log('deleting evaluation with PK = ', ePK)
      evaluationsService.deleteEvaluation(ePK)
        .then(() => {
          commit('deleteCaregiverEvaluation', ePK)
        })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  deletePatientEvaluation ({ commit }, ePK) {
    return new Promise((resolve, reject) => {
      console.log('deleting evaluation with PK = ', ePK)
      evaluationsService.deleteEvaluation(ePK)
        .then(() => {
          commit('deletePatientEvaluation', ePK)
        })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
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
