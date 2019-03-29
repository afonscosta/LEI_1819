import cuida24 from '@/services/cuida24'

export default {
  fetchMessages() {
    return cuida24.get(`messages/`)
              .then(response => response.data)
  },
  postMessage(payload) {
    return cuida24.post(`messages/`, payload)
              .then(response => response.data)
  },
  deleteMessage(msgId) {
    return cuida24.delete(`messages/${msgId}`)
              .then(response => response.data)
  }
}
