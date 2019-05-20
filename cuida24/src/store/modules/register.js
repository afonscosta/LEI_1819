import usersService from '../../services/usersService'

const actions = {
  registerCaregiver ({ commit }, payload) {
    usersService.registerCaregiver(payload)
  },
  registerPatient ({ commit }, payload) {
    usersService.registerPatient(payload)
  }
}

export default {
  namespaced: true,
  actions
}
