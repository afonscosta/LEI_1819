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
        this.dispatch('calendar/setEvents', appointments)
      })
  },
  addAppointment ({ commit }, appointment) {
    appointmentService.postAppointment(appointment)
      .then(newAppointment => {
        commit('addAppointment', newAppointment)
        this.dispatch('calendar/addEvent', newAppointment.event)
      })
  },
  updateAppointment ({ commit }, appointment) {
    appointmentService.putAppointment(appointment)
      .then(() => {
        commit('updateAppointment', appointment)
        this.dispatch('calendar/updateEvent', appointment.event)
      })
  },
  deleteAppointment ({ commit }, appointment) {
    appointmentService.deleteAppointment(appointment.appointmentPK)
    commit('deleteAppointment', appointment.appointmentPK)
    this.dispatch('calendar/deleteEvent', appointment.event.id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
