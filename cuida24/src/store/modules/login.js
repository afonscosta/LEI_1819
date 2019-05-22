import loginService from '../../services/loginService'

const state = {
  accesstoken: ''
}

const getters = {
  accesstoken: state => {
    return state.accesstoken
  }
}

const mutations = {
  setToken (state, response) {
    state.accesstoken = response.token
    console.log('teste mutations ' + state.accesstoken)
  }
}

const actions = {
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
