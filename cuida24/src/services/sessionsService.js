import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchSessions (payload) {
    return cuida24.get(`sessions/`, {
      params: {
        users: payload
      }
    }, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  postSession (payload) {
    return cuida24.post(`sessions/`, payload, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  putSession (payload) {
    return cuida24.put(`sessions/`, payload, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deleteSession (sId) {
    return cuida24.delete(`sessions/${sId}`, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  }
}
