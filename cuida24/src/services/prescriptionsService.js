import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchPrescriptions (payload) {
    return cuida24.get(`prescriptions/`, {
      params: {
        users: payload
      },
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  postPrescription (payload) {
    return cuida24.post(`prescriptions/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  putPrescription (payload) {
    return cuida24.put(`prescriptions/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deletePrescription (prescriptionId) {
    return cuida24.delete(`prescriptions/${prescriptionId}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  }
}
