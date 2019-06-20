import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchCaregivers () {
    return cuida24.get(`caregivers/`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  fetchPatients () {
    return cuida24.get(`patients/`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  fetchBackoffice () {
    return cuida24.get(`backoffice_user/`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  fetchUserAuth () {
    return cuida24.get(`authenticateUser/`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  addCaregiver (payload) {
    return cuida24.post(`caregivers/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  addPatient (payload) {
    return cuida24.post(`patients/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  addBackoffice (payload) {
    return cuida24.post(`backoffice_user/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deleteCaregiver (pk) {
    return cuida24.delete(`caregivers/${pk}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deletePatient (pk) {
    return cuida24.delete(`patients/${pk}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deleteBackoffice (pk) {
    return cuida24.delete(`backoffice_user/${pk}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  }
}
