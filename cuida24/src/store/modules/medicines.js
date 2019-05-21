import medicinesService from '../../services/medicinesService'

const state = {
  medicines: []
}

const getters = {
  medicines: state => {
    return state.medicines
  },
  getMedicineById: (state) => (id) => {
    return state.medicines.find(m => m.pk === id)
  }
}

const mutations = {
  setMedicines (state, medicines) {
    state.medicines = medicines
  },
  addMedicine (state, medicine) {
    state.medicines.push(medicine)
  },
  updateMedicine (state, medicine) {
    state.medicines = state.medicines.filter(n => n.pk !== medicine.pk)
    state.medicines.push(medicine)
  },
  deleteMedicine (state, medicineID) {
    state.medicines = state.medicines.filter(n => n.pk !== medicineID)
  }
}

const actions = {
  getMedicines ({ commit }) {
    medicinesService.fetchMedicines()
      .then(medicines => {
        console.log('medicamentos recebidos do django', medicines)
        commit('setMedicines', medicines)
      })
  },
  addMedicine ({ commit }, medicine) {
    medicinesService.postMedicine(medicine)
      .then(newMedicine => {
        commit('addMedicine', newMedicine)
      })
  },
  updateMedicine ({ commit }, medicine) {
    medicinesService.putMedicine(medicine)
      .then(() => {
        commit('updateMedicine', medicine)
      })
  },
  deleteMedicine ({ commit }, medicineID) {
    medicinesService.deleteMedicine(medicineID)
    commit('deleteMedicine', medicineID)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
