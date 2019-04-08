import loginService from '../../services/loginService'

const state = {
    accesstoken: '',
    refreshtoken: ''
}

const getters = {
    token: state => {
        return state.token
    }
}

const mutations = {
    setToken (state, response) {
        state.accesstoken = response.access
        state.refreshtoken = response.refreshtoken
        //console.log(state.token)
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
