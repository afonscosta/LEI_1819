import notesService from '../../services/notesService'

const state = {
  apptPK: null,
  notes: []
}

const getters = {
  // TODO: getter para cada tipo de user do backoffice
  notes: state => {
    return state.notes
  },
  notesEnf: state => {
    return state.notes.filter(n => n.category === 'ENF')
  },
  notesCli: state => {
    return state.notes.filter(n => n.category === 'CLI')
  },
  notesPsi: state => {
    return state.notes.filter(n => n.category === 'PSI')
  },
  notesOut: state => {
    return state.notes.filter(n => n.category === 'OUT')
  },
  apptPK: state => {
    return state.apptPK
  }
  // getAppointmentsByUserId: (state) => (id) => {
  //   return state.appointments.filter(appt => appt.user.pk === id)
  // },
}

const mutations = {
  setApptPK (state, apptPK) {
    state.apptPK = apptPK
  },
  setNotes (state, notes) {
    state.notes = notes
  },
  addNote (state, note) {
    state.notes.push(note)
  },
  updateNote (state, note) {
    state.notes = state.notes.filter(n => n.pk !== note.pk)
    state.notes.push(note)
  },
  deleteNote (state, noteID) {
    state.notes = state.notes.filter(n => n.pk !== noteID)
  }
}

const actions = {
  setApptPK ({ commit }, apptPK) {
    commit('setApptPK', apptPK)
  },
  getNotes ({ commit }, payload) {
    notesService.fetchNotes(payload)
      .then(notes => {
        console.log('notas recebidas do django', notes)
        commit('setNotes', notes)
      })
  },
  addNote ({ commit }, note) {
    notesService.postNote(note)
      .then(newNote => {
        commit('addNote', newNote)
      })
  },
  updateNote ({ commit }, note) {
    notesService.putNote(note)
      .then(() => {
        commit('updateNote', note)
      })
  },
  deleteNote ({ commit }, noteID) {
    notesService.deleteNote(noteID)
    commit('deleteNote', noteID)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
