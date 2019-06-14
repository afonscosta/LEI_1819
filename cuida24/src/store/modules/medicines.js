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
    return new Promise((resolve, reject) => {
      medicinesService.postMedicine(medicine)
        .then(newMedicine => {
          commit('addMedicine', newMedicine)
        })
        .then(response => {
          resolve(response)
        }, error => {
          reject(error)
        })
    })
  },
  updateMedicine ({ commit }, medicine) {
    return new Promise((resolve, reject) => {
      medicinesService.putMedicine(medicine)
        .then(() => {
          commit('updateMedicine', medicine)
        })
        .then(response => {
          resolve(response)
        }, error => {
          reject(error)
        })
    })
  },
  deleteMedicine ({ commit }, medicineID) {
    return new Promise((resolve, reject) => {
      medicinesService.deleteMedicine(medicineID)
        .then(() => {
          commit('deleteMedicine', medicineID)
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
  getters,
  actions,
  mutations
}
