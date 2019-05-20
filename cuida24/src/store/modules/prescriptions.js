import prescriptionsService from '../../services/prescriptionsService'

const state = {
  prescriptions: []
}

const getters = {
  prescriptions: state => {
    return state.prescriptions
  },
  getPrescriptionsByUserId: (state) => (id) => {
    return state.prescriptions.filter(p => p.user.pk === id)
  },
  getPrescriptionsById: (state) => (id) => {
    return state.prescriptions.find(p => p.prescriptionPK === id)
  }
}

const mutations = {
  setPrescriptions (state, prescriptions) {
    state.prescriptions = prescriptions
  },
  addPrescription (state, prescription) {
    state.prescriptions.push(prescription)
  },
  updatePrescription (state, prescription) {
    state.prescriptions = state.prescriptions.filter(p => p.pk !== prescription.pk)
    state.prescriptions.push(prescription)
  },
  deletePrescription (state, prescriptionID) {
    state.prescriptions = state.prescriptions.filter(p => p.prescriptionPK !== prescriptionID)
  }
}

const actions = {
  setPrescriptions ({ commit }, prescriptions) {
    console.log('set prescriptions', prescriptions)
    commit('setPrescriptions', prescriptions)
    this.dispatch('events/addEvents', prescriptions)
  },
  getPrescriptions ({ commit }, payload) {
    prescriptionsService.fetchPrescriptions(payload)
      .then(prescriptions => {
        console.log('getPrescriptions', prescriptions)
        commit('setPrescriptions', prescriptions)
        this.dispatch('events/setEvents', prescriptions)
      })
  },
  addPrescription ({ commit }, prescription) {
    prescriptionsService.postPrescription(prescription)
      .then(newPrescription => {
        commit('addPrescription', newPrescription)
        this.dispatch('events/addEvent', newPrescription.event)
      })
  },
  updatePrescription ({ commit }, prescription) {
    prescriptionsService.putPrescription(prescription)
      .then(() => {
        commit('updatePrescription', prescription)
        this.dispatch('events/updateEvent', prescription.event)
      })
  },
  deletePrescription ({ commit }, prescription) {
    prescriptionsService.deletePrescription(prescription.prescriptionPK)
    commit('deletePrescription', prescription.prescriptionPK)
    this.dispatch('events/deleteEvent', prescription.event.id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
