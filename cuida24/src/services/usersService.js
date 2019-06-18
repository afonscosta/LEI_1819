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
  registerCaregiver (payload) {
    console.log('teste de token no request' + store.state.accesstoken)
    console.log(payload)
    return cuida24.post(`caregivers/`, {
      info: payload
    }, {
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
  registerPatient (payload) {
    return cuida24.post(`patients/`, {
      info: payload
    }, {
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
  }
}
