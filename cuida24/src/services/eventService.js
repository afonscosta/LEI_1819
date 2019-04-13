import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchEvents () {
    // console.log("teste " + store.state.accesstoken);
    return cuida24.get(`events/`, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  postEvent (payload) {
    return cuida24.post(`events/`, payload, {
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
