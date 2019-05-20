import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchEvents (payload) {
    return cuida24.get(`events/`, {
      params: {
        users: payload
      },
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  }
}
