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
    loginService.getToken(credencials)
      .then(response => {
        commit('setToken', response)
        console.log('teste de receção token na action ' + state.accesstoken)
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
