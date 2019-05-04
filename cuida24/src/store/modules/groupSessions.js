import groupSessionsService from '../../services/groupSessionsService'

const state = {
  groupSessions: []
}

const getters = {
  groupSessions: state => {
    return state.groupSessions
  }
}

const mutations = {
  setGroupSessions (state, gss) {
    state.groupSessions = gss
  },
  addGroupSession (state, gs) {
    state.groupSessions.push(gs)
  },
  updateGroupSession (state, gs) {
    state.groupSessions = state.groupSessions.filter(g => g.pk !== gs.pk)
    state.groupSessions.push(gs)
  },
  deleteGroupSession (state, gsID) {
    state.groupSessions = state.groupSessions.filter(g => g.pk !== gsID)
  }
}

const actions = {
  getGroupSessions ({ commit }, payload) {
    groupSessionsService.fetchGroupSessions(payload)
      .then(gss => {
        console.log('groupSessions recebidas do django', gss)
        commit('setGroupSessions', gss)
      })
  },
  addGroupSession ({ commit }, gs) {
    console.log('adding groupSession', gs)
    groupSessionsService.postGroupSession(gs)
      .then(newGS => {
        commit('addGroupSession', newGS)
      })
  },
  updateGroupSession ({ commit }, gs) {
    console.log('updating groupSession', gs)
    groupSessionsService.putGroupSession(gs)
      .then(() => {
        commit('updateGroupSession', gs)
      })
  },
  deleteGroupSession ({ commit }, gsID) {
    console.log('deleting groupSession with PK = ', gsID)
    groupSessionsService.deleteGroupSession(gsID)
    commit('deleteGroupSession', gsID)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
