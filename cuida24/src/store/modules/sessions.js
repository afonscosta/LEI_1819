import sessionsService from '../../services/sessionsService'

const state = {
  groupSessions: [],
  indivSessions: []
}

const getters = {
  groupSessions: state => {
    return state.groupSessions
  },
  indivSessions: state => {
    return state.indivSessions
  }
}

const mutations = {
  setSessions (state, ss) {
    state.groupSessions = []
    state.indivSessions = []
    ss.forEach((s) => {
      if (s.groupSession) {
        state.groupSessions.push(s)
      } else {
        state.indivSessions.push(s)
      }
    })
  },
  addGroupSession (state, gs) {
    state.groupSessions.push(gs)
  },
  addIndivSession (state, is) {
    state.indivSessions.push(is)
  },
  updateGroupSession (state, gs) {
    state.groupSessions = state.groupSessions.filter(s => s.pk !== gs.pk)
    state.groupSessions.push(gs)
  },
  updateIndivSession (state, is) {
    state.indivSessions = state.indivSessions.filter(s => s.pk !== is.pk)
    state.indivSessions.push(is)
  },
  deleteGroupSession (state, gsID) {
    state.groupSessions = state.groupSessions.filter(s => s.pk !== gsID)
  },
  deleteIndivSession (state, isID) {
    state.indivSessions = state.indivSessions.filter(s => s.pk !== isID)
  }
}

const actions = {
  setSessions ({ commit }, ss) {
    console.log('set sessions', ss)
    commit('setSessions', ss)
    this.dispatch('events/addEvents', ss)
  },
  getSessions ({ commit }, payload) {
    sessionsService.fetchSessions(payload)
      .then(ss => {
        console.log('sessions recebidas do django', ss)
        commit('setSessions', ss)
      })
  },
  addGroupSession ({ commit }, gs) {
    console.log('adding groupSession', gs)
    sessionsService.postSession(gs)
      .then(newGS => {
        commit('addGroupSession', newGS)
        this.dispatch('events/addEvent', newGS.event)
      })
  },
  addIndivSession ({ commit }, is) {
    console.log('adding indivSession', is)
    sessionsService.postSession(is)
      .then(newIS => {
        commit('addIndivSession', newIS)
        this.dispatch('events/addEvent', newIS.event)
      })
  },
  updateGroupSession ({ commit }, gs) {
    console.log('updating groupSession', gs)
    sessionsService.putSession(gs)
      .then(() => {
        commit('updateGroupSession', gs)
        this.dispatch('events/updateEvent', gs.event)
      })
  },
  updateIndivSession ({ commit }, is) {
    console.log('updating indivSession', is)
    sessionsService.putSession(is)
      .then(() => {
        commit('updateIndivSession', is)
        this.dispatch('events/updateEvent', is.event)
      })
  },
  deleteGroupSession ({ commit }, gsID) {
    console.log('deleting groupSession with PK = ', gsID)
    sessionsService.deleteSession(gsID)
    commit('deleteGroupSession', gsID)
  },
  deleteIndivSession ({ commit }, isID) {
    console.log('deleting indivSession with PK = ', isID)
    sessionsService.deleteSession(isID)
    commit('deleteSession', isID)
    // TODO: É preciso fazer delete do evento
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
