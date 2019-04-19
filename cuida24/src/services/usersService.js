import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchCaregivers () {
    return cuida24.get(`caregivers/`, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  fetchPatients () {
    return cuida24.get(`patients/`, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  }
}
