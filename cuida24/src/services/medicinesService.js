import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchMedicines () {
    return cuida24.get(`medicine/`, {
    }, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  postMedicine (payload) {
    return cuida24.post(`medicine/`, payload, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  putNote (payload) {
    return cuida24.put(`medicine/`, payload, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deleteNote (medicineId) {
    return cuida24.delete(`medicine/${medicineId}`, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  }
}
