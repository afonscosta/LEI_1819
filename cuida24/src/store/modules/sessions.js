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
    console.log('gsid', gs.groupSession.pk)
    console.log('antes', state.groupSessions)
    state.groupSessions = state.groupSessions.filter(s => s.groupSession.pk !== gs.groupSession.pk)
    console.log('depois', state.groupSessions)
    state.groupSessions.push(gs)
    console.log('depois', state.groupSessions)
  },
  updateIndivSession (state, is) {
    state.indivSessions = state.indivSessions.filter(s => s.individualSession.pk !== is.individualSession.pk)
    state.indivSessions.push(is)
  },
  deleteGroupSession (state, gsID) {
    console.log('gsid', gsID)
    console.log('antes', state.groupSessions)
    state.groupSessions = state.groupSessions.filter(s => s.groupSession.pk !== gsID)
    console.log('depois', state.groupSessions)
  },
  deleteIndivSession (state, isID) {
    state.indivSessions = state.indivSessions.filter(s => s.individualSession.pk !== isID)
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
    sessionsService.putSession(gs.send)
      .then(() => {
        if (gs.stay) {
          commit('updateGroupSession', gs.stay)
        }
        this.dispatch('events/updateEvent', gs.send.event)
      })
  },
  updateIndivSession ({ commit }, is) {
    console.log('updating indivSession', is)
    sessionsService.putSession(is.send)
      .then(() => {
        if (is.stay) {
          commit('updateIndivSession', is.stay)
        }
        this.dispatch('events/updateEvent', is.send.event)
      })
  },
  deleteGroupSession ({ commit }, gs) {
    console.log('deleting groupSession with PK = ', gs.groupSession.pk)
    sessionsService.deleteSession(gs.groupSession.pk)
    commit('deleteGroupSession', gs.groupSession.pk)
    this.dispatch('events/deleteEvent', gs.event.id)
  },
  deleteIndivSession ({ commit }, is) {
    console.log('deleting indivSession with PK = ', is.individualSession.pk)
    sessionsService.deleteSession(is.individualSession.pk)
    commit('deleteIndivSession', is.individualSession.pk)
    this.dispatch('events/deleteEvent', is.event.id)
  },
  dontShowGroupSession ({ commit }, gs) {
    console.log('not showing groupSession with PK = ', gs.groupSession.pk)
    commit('deleteGroupSession', gs.groupSession.pk)
    this.dispatch('events/deleteEvent', gs.event.id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
