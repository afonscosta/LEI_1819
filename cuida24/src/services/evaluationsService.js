import cuida24 from '@/services/cuida24'
import store from '@/store/modules/login'

export default {
  fetchEvaluations (payload) {
    return cuida24.get(`evaluation/`, {
      params: {
        sessionPK: payload
      }
    }, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  postEvaluation (payload) {
    return cuida24.post(`evaluation/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  putEvaluation (payload) {
    return cuida24.put(`evaluation/`, payload, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  },
  deleteEvaluation (eId) {
    return cuida24.delete(`evaluation/${eId}`, {
      headers: {
        Authorization: 'Token ' + store.state.accesstoken
      }
    }).then(response => response.data)
  }
}
