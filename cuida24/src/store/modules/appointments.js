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
  setAppointments ({ commit }, appointments) {
    console.log('set appointments', appointments)
    commit('setAppointments', appointments)
    this.dispatch('events/addEvents', appointments)
  },
  getAppointments ({ commit }, payload) {
    appointmentService.fetchAppointments(payload)
      .then(appointments => {
        console.log('getAppointments', appointments)
        commit('setAppointments', appointments)
        this.dispatch('events/setEvents', appointments)
      })
  },
  addAppointment ({ commit }, appointment) {
    return new Promise((resolve, reject) => {
      appointmentService.postAppointment(appointment)
        .then(newAppointment => {
          commit('addAppointment', newAppointment)
          this.dispatch('events/addEvent', newAppointment.event)
        })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateAppointment ({ commit }, appointment) {
    return new Promise((resolve, reject) => {
      appointmentService.putAppointment(appointment)
        .then(() => {
          commit('updateAppointment', appointment)
          this.dispatch('events/updateEvent', appointment.event)
        })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteAppointment ({ commit }, appointment) {
    return new Promise((resolve, reject) => {
      appointmentService.deleteAppointment(appointment.appointmentPK)
        .then(() => {
          commit('deleteAppointment', appointment.appointmentPK)
          this.dispatch('events/deleteEvent', appointment.event.id)
        })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
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
