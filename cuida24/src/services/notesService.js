import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchNotes (payload) {
    return cuida24.get(`appointmentNotes/`, {
      params: {
        appointment: payload
      }
    }, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  postNote (payload) {
    return cuida24.post(`appointmentNotes/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  putNote (payload) {
    return cuida24.put(`appointmentNotes/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deleteNote (noteId) {
    return cuida24.delete(`appointmentNotes/${noteId}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  }
}
