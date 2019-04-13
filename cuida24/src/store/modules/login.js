import loginService from '../../services/loginService'

const state = {
  accesstoken: '',
  refreshtoken: ''
}

const getters = {
  accesstoken: state => {
    return state.accesstoken
  },
  refreshtoken: state => {
    return state.refreshtoken
  }
}

const mutations = {
  setToken (state, response) {
    state.accesstoken = response.access
    state.refreshtoken = response.refresh
    // console.log("teste mutations " + state.refreshtoken)
  }
}

const actions = {
  getToken ({ commit }, credencials) {
    loginService.getToken(credencials)
      .then(response => {
        commit('setToken', response)
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
