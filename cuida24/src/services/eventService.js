import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchEvents (payload) {
    return cuida24.get(`appointments/`, {
      params: {
        users: payload
      }
    }, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  postEvent (payload) {
    return cuida24.post(`appointments/`, payload, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  putEvent (payload) {
    return cuida24.put(`appointments/`, payload, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deleteEvent (eventId) {
    return cuida24.delete(`events/${eventId}`, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  }
}
