import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchAppointments (payload) {
    return cuida24.get(`appointments/`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      },
      params: {
        users: payload
      }
    }).then(response => response.data)
  },
  postAppointment (payload) {
    return cuida24.post(`appointments/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deleteAppointment (appointmentId) {
    return cuida24.delete(`appointments/${appointmentId}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  }
}
