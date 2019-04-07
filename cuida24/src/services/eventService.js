import cuida24 from '@/services/cuida24'

export default {
  fetchEvents () {
    return cuida24.get(`events/`)
      .then(response => response.data)
  },
  postEvent (payload) {
    return cuida24.post(`events/`, payload)
      .then(response => response.data)
  },
  deleteEvent (eventId) {
    return cuida24.delete(`events/${eventId}`)
      .then(response => response.data)
  }
}
