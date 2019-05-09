import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchEvents (payload) {
    return cuida24.get(`appointments/`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      },
      params: {
        users: payload
      }
    }).then(response => response.data)
  },
  postEvent (payload) {
    return cuida24.post(`appointments/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  putEvent (payload) {
    return cuida24.put(`appointments/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deleteEvent (eventId) {
    return cuida24.delete(`events/${eventId}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  }
}
