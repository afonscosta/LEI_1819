import loginService from '../../services/loginService'

const state = {
  accesstoken: null
}

const getters = {
  accesstoken: state => {
    return state.accesstoken
  }
}

const mutations = {
  setToken (state, response) {
    state.accesstoken = response.token
    localStorage.setItem('token', response.token)
  },
  setPlainToken (state, token) {
    state.accesstoken = token
    localStorage.setItem('token', token)
  },
  deleteToken (state) {
    state.accesstoken = null
    localStorage.removeItem('token')
  }
}

const actions = {
  setPlainToken ({ commit }, token) {
    commit('setPlainToken', token)
  },
  deleteToken ({ commit }) {
    commit('deleteToken')
  },
  getToken ({ commit }, credencials) {
    return new Promise((resolve, reject) => {
      loginService.getToken(credencials)
        .then(function (response) {
          commit('setToken', response)
        })
        .then(response => {
          resolve(response)
        }, error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
