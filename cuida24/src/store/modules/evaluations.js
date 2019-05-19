import evaluationsService from '../../services/evaluationsService'

const state = {
  session: {},
  evaluations: []
}

const getters = {
  session: state => {
    return state.session
  },
  evaluations: state => {
    return state.evaluations
  },
  getCaregiversInfo (state, getters, rootState, rootGetters) {
    let users = []
    users.push(...state.session.event.users.caregivers.map(pk => rootGetters['users/getCaregiverById'](pk)))
    return users
  },
  getPatientsInfo (state, getters, rootState, rootGetters) {
    let users = []
    users.push(...state.session.event.users.patients.map(pk => rootGetters['users/getPatientById'](pk)))
    return users
  }
}

const mutations = {
  setSession (state, s) {
    state.session = s
  },
  setEvaluations (state, es) {
    state.evaluations = es
  },
  addEvaluation (state, e) {
    state.evaluations.push(e)
  },
  updateEvaluation (state, newE) {
    state.evaluations = state.evaluations.filter(e => e.pk !== newE.pk)
    state.evaluations.push(newE)
  },
  deleteEvaluation (state, ePK) {
    state.evaluations = state.evaluations.filter(e => e.pk !== ePK)
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
  addEvaluation ({ commit }, e) {
    console.log('adding evaluation', e)
    evaluationsService.postEvaluation(e)
      .then(newE => {
        commit('addEvaluation', newE)
      })
  },
  updateEvaluation ({ commit }, e) {
    console.log('updating evaluation', e)
    evaluationsService.putEvaluation(e)
      .then(() => {
        commit('updateEvaluation', e)
      })
  },
  deleteEvaluation ({ commit }, e) {
    console.log('deleting evaluation with PK = ', e.pk)
    evaluationsService.deleteEvaluation(e.pk)
    commit('deleteEvaluation', e.pk)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
