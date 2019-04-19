import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchCalendars () {
    return cuida24.get(`calendars/`, {
      headers: {
        Authorization: 'Bearer ' + store.state.accesstoken
      }
    }).then(response => response.data)
  }
}
