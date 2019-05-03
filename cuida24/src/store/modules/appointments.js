import appointmentService from '../../services/appointmentService'

const state = {
  appointments: []
}

const getters = {
  appointments: state => {
    return state.appointments
  },
  getAppointmentsByUserId: (state) => (id) => {
    return state.appointments.filter(appt => appt.user.pk === id)
  },
  getAppointmentsById: (state) => (id) => {
    return state.appointments.find(appt => appt.appointmentPK === id)
  }
}

const mutations = {
  setAppointments (state, appointments) {
    state.appointments = appointments
  },
  addAppointment (state, appointment) {
    state.appointments.push(appointment)
  },
  updateAppointment (state, appointment) {
    state.appointments = state.appointments.filter(a => a.pk !== appointment.pk)
    state.appointments.push(appointment)
  },
  deleteAppointment (state, appointmentID) {
    state.appointments = state.appointments.filter(a => a.appointmentPK !== appointmentID)
  }
}

const actions = {
  getAppointments ({ commit }, payload) {
    appointmentService.fetchAppointments(payload)
      .then(appointments => {
        commit('setAppointments', appointments)
      })
  },
  addAppointment ({ commit }, appointment) {
    appointmentService.postAppointment(appointment)
      .then(newAppointment => {
        commit('addAppointment', newAppointment)
      })
  },
  updateAppointment ({ commit }, appointment) {
    appointmentService.postAppointment(appointment)
      .then(() => {
        commit('updateAppointment', appointment)
      })
  },
  deleteAppointment ({ commit }, appointmentID) {
    appointmentService.deleteAppointment(appointmentID)
    commit('deleteAppointment', appointmentID)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
