import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchGroupSessions (payload) {
    return cuida24.get(`groupSessions/`, {
      params: {
        users: payload
      }
    }, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  postGroupSession (payload) {
    return cuida24.post(`groupSessions/`, payload, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  putGroupSession (payload) {
    return cuida24.put(`groupSessions/`, payload, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deleteGroupSession (gsId) {
    return cuida24.delete(`groupSessions/${gsId}`, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  }
}
