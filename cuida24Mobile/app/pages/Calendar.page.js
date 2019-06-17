import React from 'react'
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Platform,
  Linking,
  FlatList,
  ListView,
  ActivityIndicator
} from 'react-native'
import { Card, List, ListItem, CheckBox, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { StackNavigator } from 'react-navigation';
import RNCalendarEvents from 'react-native-calendar-events';
import { sha256 } from 'react-native-sha256';
import { addMinutes, addDays, addWeeks, addMonths } from 'date-fns';
import PushNotification from 'react-native-push-notification';
import {
  RadioForm,
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button';

const parseSchedule = (event) => {
	var rec = null;
	if (event.event.schedule.duration &&
	event.event.schedule.durationInDays === 0 &&
	event.event.schedule.durationUnit &&
	!event.event.schedule.dayOfWeek &&
	!event.event.schedule.dayOfMonth &&
	!event.event.schedule.month &&
	!event.event.schedule.year) {
		rec = 'daily';
	}
	else if (!event.event.schedule.durationInDays &&
	event.event.schedule.dayOfWeek &&
	!event.event.schedule.dayOfMonth &&
	!event.event.schedule.month &&
	!event.event.schedule.year) {
		rec = 'weekly';
	}
	else if (!event.event.schedule.durationInDays &&
	!event.event.schedule.dayOfWeek &&
	event.event.schedule.dayOfMonth &&
	!event.event.schedule.month &&
	!event.event.schedule.year) {
		rec = 'monthly';
	}
	else if (!event.event.schedule.durationInDays &&
	!event.event.schedule.dayOfWeek &&
	event.event.schedule.dayOfMonth &&
	event.event.schedule.month &&
	!event.event.schedule.year) {
		rec = 'yearly';
	}
  return rec;
}

const addNewAppointment = async (appt, hash, appointmentCalendar, eventID) => {
  console.log('Adicionando evento...', appt);
	var today = new Date();
	var rec = parseSchedule(appt);
  appt.event.data.notify.forEach((notif) => {
		var n = new Date(notif);
		if (n > today) {
      if (rec === 'daily') {
        PushNotification.localNotificationSchedule({
          message: appt.event.data.title + '\n' + 
            appt.event.data.description + '\n' +
            appt.event.data.location,
          date: n,
          repeatType: 'day'
        });
      } else if (rec === 'weekly') {
        PushNotification.localNotificationSchedule({
          message: appt.event.data.title + '\n' + 
            appt.event.data.description + '\n' +
            appt.event.data.location,
          date: n,
          repeatType: 'week'
        });
      } else {
        PushNotification.localNotificationSchedule({
          message: appt.event.data.title + '\n' + 
            appt.event.data.description + '\n' +
            appt.event.data.location,
          date: n
        });
      }
		}
  });
	var allDay = true;
	var startDate = new Date(
    appt.occurrenceDate.year,
    appt.occurrenceDate.month-1, // Porque os meses são de 0 a 11
    appt.occurrenceDate.dayOfMonth+1
  )
	var endDate = new Date(
    appt.occurrenceDate.year,
    appt.occurrenceDate.month-1, // Porque os meses são de 0 a 11
    appt.occurrenceDate.dayOfMonth+1
  )
	var timeSplit = ["00", "00", "00"];
	if (appt.event.schedule.times) {
		allDay = false;
		timeSplit = appt.event.schedule.times[0].split(":");
		startDate = new Date(
			appt.occurrenceDate.year,
			appt.occurrenceDate.month-1, // Porque os meses são de 0 a 11
			appt.occurrenceDate.dayOfMonth,
			parseInt(timeSplit[0]),
			parseInt(timeSplit[1]),
			parseInt(timeSplit[2])
		);
		if (appt.event.schedule.durationUnit == "minutes") {
			endDate = addMinutes(startDate, appt.event.schedule.duration);
		}
		else if (appt.event.schedule.durationUnit == "days") {
			endDate = addDays(startDate, appt.event.schedule.duration);
		}
		else if (appt.event.schedule.durationUnit == "weeks") {
			endDate = addWeeks(startDate, appt.event.schedule.duration);
		}
		else if (appt.event.schedule.durationUnit == "months") {
			endDate = addMonths(startDate, appt.event.schedule.duration);
		}
	}
	else {
		endDate = startDate;
	}
  //console.log(JSON.stringify(appt.event));
  //console.log('startDate', JSON.stringify(startDate));
  //console.log('endDate', JSON.stringify(endDate));
	var eventData = {
		calendarId: appointmentCalendar.id,
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
		allDay: appt.event.schedule.times ? false : true,
		location: appt.event.data.location,
		description: appt.event.data.description,
		recurrence: rec
	};

  if (eventID) { // Para fazer update do event
    eventData.id = eventID;
  }

	if (eventData.recurrence == null) {
		delete eventData.recurrence;
	}
	
  RNCalendarEvents.saveEvent(
    appt.event.data.title, 
		eventData
  ).then(id => { 
    AsyncStorage.setItem(
      '@appointmentCalendar:' + appt.appointmentPK,
      JSON.stringify({ 'id': id, 'hash': String(hash) })
    ).catch((error) => {
      console.warn('AsyncStorage - setItem', error);
    });
  }).catch(error => console.warn('RNCalendarEvents - saveEvent', error));
}

const handleAppointment = async (appt, hash, appointmentCalendar) => {
  //await AsyncStorage.clear();
  AsyncStorage.getItem('@appointmentCalendar:' + appt.appointmentPK)
    .then((oldEvData) => {
      if (oldEvData == null) { // O evento ainda não existe
        addNewAppointment(appt, hash, appointmentCalendar, null);
      }
      else { // Já tem o evento. Está atualizado?
        var oldEvDataParsed = JSON.parse(oldEvData);
        if (oldEvDataParsed.hash !== hash) { // O evento mudou
          AsyncStorage.removeItem('@appointmentCalendar:' + appt.appointmentPK)
            .then(() => {
              // Adiciona o evento atualizado
              addNewAppointment(appt, hash, appointmentCalendar, oldEvDataParsed.id);
            })
            .catch((error) => {
              console.warn('AsyncStorage - removeItem', error);
            });
        }
      }
    })
    .catch((error) => {
      console.warn('AsyncStorage - handleAppointment', error);
    });
}

const addNewIndivSession = async (is, hash, indivSessionCalendar, eventID) => {
  console.log('Adicionando indivSession evento...', is);
	var today = new Date();
  is.event.data.notify.forEach((notif) => {
		var n = new Date(notif);
		if (n > today) {
			PushNotification.localNotificationSchedule({
				message: is.event.data.title + '\n' + 
					is.individualSession.theme + ' - ' + is.individualSession.description + '\n' +
					is.event.data.location,
				date: n
			});
		}
  });
	var rec = parseSchedule(is);
	var allDay = true;
	var startDate = new Date(
    is.event.occurrenceDate.year,
    is.event.occurrenceDate.month-1, // Porque os meses são de 0 a 11
    is.event.occurrenceDate.dayOfMonth+1
  )
	var endDate = new Date(
    is.event.occurrenceDate.year,
    is.event.occurrenceDate.month-1, // Porque os meses são de 0 a 11
    is.event.occurrenceDate.dayOfMonth+1
  )
	var timeSplit = ["00", "00", "00"];
	if (is.event.schedule.times) {
		allDay = false;
		timeSplit = is.event.schedule.times[0].split(":");
		startDate = new Date(
			is.event.occurrenceDate.year,
			is.event.occurrenceDate.month-1, // Porque os meses são de 0 a 11
			is.event.occurrenceDate.dayOfMonth,
			parseInt(timeSplit[0])+1, // Porquê que preciso de somar 1???
			parseInt(timeSplit[1]),
			parseInt(timeSplit[2])
		);
		if (is.event.schedule.durationUnit == "minutes") {
			endDate = addMinutes(startDate, is.event.schedule.duration);
		}
		else if (is.event.schedule.durationUnit == "days") {
			endDate = addDays(startDate, is.event.schedule.duration);
		}
		else if (is.event.schedule.durationUnit == "weeks") {
			endDate = addWeeks(startDate, is.event.schedule.duration);
		}
		else if (is.event.schedule.durationUnit == "months") {
			endDate = addMonths(startDate, is.event.schedule.duration);
		}
	}
	else {
		endDate = startDate;
	}
	var eventData = {
		calendarId: indivSessionCalendar.id,
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
		allDay: is.event.schedule.times ? false : true,
		location: is.event.data.location,
		description: is.individualSession.theme + ' - ' + is.individualSession.description,
		recurrence: rec
	};

  if (eventID) { // Para fazer update do event
    eventData.id = eventID;
  }

	if (eventData.recurrence == null) {
		delete eventData.recurrence;
	}
	
  RNCalendarEvents.saveEvent(
    is.event.data.title, 
		eventData
  ).then(id => { 
		(async () => {
			try {
				await AsyncStorage.setItem(
					'@indivSessionCalendar:' + is.individualSession.pk,
					JSON.stringify({ 'id': id, 'hash': String(hash) })
				);
			} catch (error) {
				console.warn('AsyncStorage - setItem', error);
			}
		})();
  }).catch(error => console.warn('RNCalendarEvents - saveEvent', error));
}

const handleIndivSession = async (is, hash, indivSessionCalendar) => {
  //await AsyncStorage.clear();
  AsyncStorage.getItem('@indivSessionCalendar:' + is.individualSession.pk)
    .then((oldEvData) => {
      if (oldEvData == null) { // O evento ainda não existe
        addNewIndivSession(is, hash, indivSessionCalendar, null);
      }
      else { // Já tem o evento. Está atualizado?
        var oldEvDataParsed = JSON.parse(oldEvData);
        if (oldEvDataParsed.hash !== hash) { // O evento mudou
          AsyncStorage.removeItem('@indivSessionCalendar:' + is.individualSession.pk)
            .then(() => {
              // Adiciona o evento atualizado
              addNewIndivSession(is, hash, indivSessionCalendar, oldEvDataParsed.id);
            })
            .catch((error) => {
              console.warn('AsyncStorage - removeItem', error);
            });
        }
      }
    })
    .catch((error) => {
      console.warn('AsyncStorage - handleIndivSession', error);
    });
}

const addNewGroupSession = async (gs, hash, groupSessionCalendar, eventID) => {
  console.log('Adicionando groupSession evento...', gs);
	var today = new Date();
  gs.event.data.notify.forEach((notif) => {
		var n = new Date(notif);
		if (n > today) {
			PushNotification.localNotificationSchedule({
				message: gs.event.data.title + '\n' + 
					gs.groupSession.theme + ' - ' + gs.groupSession.description + '\n' +
					gs.event.data.location,
				date: n
			});
		}
  });
	var rec = parseSchedule(gs);
	var allDay = true;
	var startDate = new Date(
    gs.event.occurrenceDate.year,
    gs.event.occurrenceDate.month-1, // Porque os meses são de 0 a 11
    gs.event.occurrenceDate.dayOfMonth+1
  )
	var endDate = new Date(
    gs.event.occurrenceDate.year,
    gs.event.occurrenceDate.month-1, // Porque os meses são de 0 a 11
    gs.event.occurrenceDate.dayOfMonth+1
  )
	var timeSplit = ["00", "00", "00"];
	if (gs.event.schedule.times) {
		allDay = false;
		timeSplit = gs.event.schedule.times[0].split(":");
		startDate = new Date(
			gs.event.occurrenceDate.year,
			gs.event.occurrenceDate.month-1, // Porque os meses são de 0 a 11
			gs.event.occurrenceDate.dayOfMonth,
			parseInt(timeSplit[0])+1, // Porquê que preciso de somar 1???
			parseInt(timeSplit[1]),
			parseInt(timeSplit[2])
		);
		if (gs.event.schedule.durationUnit == "minutes") {
			endDate = addMinutes(startDate, gs.event.schedule.duration);
		}
		else if (gs.event.schedule.durationUnit == "days") {
			endDate = addDays(startDate, gs.event.schedule.duration);
		}
		else if (gs.event.schedule.durationUnit == "weeks") {
			endDate = addWeeks(startDate, gs.event.schedule.duration);
		}
		else if (gs.event.schedule.durationUnit == "months") {
			endDate = addMonths(startDate, gs.event.schedule.duration);
		}
	}
	else {
		endDate = startDate;
	}
	var eventData = {
		calendarId: groupSessionCalendar.id,
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
		allDay: gs.event.schedule.times ? false : true,
		location: gs.event.data.location,
		description: gs.groupSession.theme + ' - ' + gs.groupSession.description,
		recurrence: rec
	};

  if (eventID) { // Para fazer update do event
    eventData.id = eventID;
  }

	if (eventData.recurrence == null) {
		delete eventData.recurrence;
	}
	
  RNCalendarEvents.saveEvent(
    gs.event.data.title, 
		eventData
  ).then(id => { 
		(async () => {
			try {
				await AsyncStorage.setItem(
					'@groupSessionCalendar:' + gs.groupSession.pk,
					JSON.stringify({ 'id': id, 'hash': String(hash) })
				);
			} catch (error) {
				console.warn('AsyncStorage - setItem', error);
			}
		})();
  }).catch(error => console.warn('RNCalendarEvents - saveEvent', error));
}

const handleGroupSession = async (gs, hash, groupSessionCalendar) => {
  //await AsyncStorage.clear();
  AsyncStorage.getItem('@groupSessionCalendar:' + gs.groupSession.pk)
    .then((oldEvData) => {
      if (oldEvData == null) { // O evento ainda não existe
        addNewGroupSession(gs, hash, groupSessionCalendar, null);
      }
      else { // Já tem o evento. Está atualizado?
        var oldEvDataParsed = JSON.parse(oldEvData);
        if (oldEvDataParsed.hash !== hash) { // O evento mudou
          AsyncStorage.removeItem('@groupSessionCalendar:' + gs.groupSession.pk)
            .then(() => {
              // Adiciona o evento atualizado
              addNewGroupSession(gs, hash, groupSessionCalendar, oldEvDataParsed.id);
            })
            .catch((error) => {
                  console.warn('AsyncStorage - removeItem', error);
            });
        }
      }
    })
    .catch((error) => {
      console.warn('AsyncStorage - handleGroupSession', error);
    });
}

export default class CalendarPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      cal_auth: '',
      token: '',
      loading: false,
      appointments: [],
      groupSessions: [],
      indivSessions: [],
      calendars: [],
      error: null,
      refreshing: false,
      base_url: "http://10.0.2.2:8000/cuida24/",
      filters: [
        {label: 'Consultas', value: 0 },
        {label: 'Sessões de Grupo', value: 1 },
        {label: 'Sessões Individuais', value: 2 }
      ],
      apptFilterSelected: false,
      gsFilterSelected: false,
      isFilterSelected: false,
			selectedFilter: 0
    }
  }
  
  durationUnitTranslated (durationUnit) {
    if (durationUnit === 'minutes') {
      return 'minuto(s)'
    } else if (durationUnit === 'hours') {
      return 'hora(s)'
    } else if (durationUnit === 'days') {
      return 'dia(s)'
    } else if (durationUnit === 'weeks') {
      return 'semana(s)'
    } else if (durationUnit === 'months') {
      return 'mês(es)'
    }
  }

  getAppointmentCalendar(result) {
    return result.find(c =>
      c.title === 'Consultas' &&
      c.type === 'LOCAL' && 
      c.isPrimary &&
      !c.allowsModifications
    );
  }

  getMedicationCalendar(result) {
    return result.find(c =>
      c.title === 'Medicação' &&
      c.type === 'LOCAL' && 
      c.isPrimary &&
      !c.allowsModifications
    );
  }

  getGroupSessionCalendar(result) {
    return result.find(c =>
      c.title === 'Sessões de Grupo' &&
      c.type === 'LOCAL' && 
      c.isPrimary &&
      !c.allowsModifications
    );
  }

  getIndivSessionCalendar(result) {
    return result.find(c =>
      c.title === 'Sessões Individuais' &&
      c.type === 'LOCAL' && 
      c.isPrimary &&
      !c.allowsModifications
    );
  }

  componentWillMount () {
    // iOS
    RNCalendarEvents.authorizationStatus()
      .then(status => {
        // if the status was previous accepted, set the authorized status to state
        this.setState({ cal_auth: status })
        if(status === 'undetermined') {
          // if we made it this far, we need to ask the user for access 
          RNCalendarEvents.authorizeEventStore()
          .then((out) => {
            if(out == 'authorized') {
              // set the new status to the auth state
              this.setState({ cal_auth: out })
            }
          })
        }
      })
      .catch(error => console.warn('Auth Error: ', error));
  
    // Android
    RNCalendarEvents.authorizeEventStore()
      .then((out) => {
        if(out == 'authorized') {
          // set the new status to the auth state
          this.setState({ cal_auth: out })
        }
      })
      .catch(error => console.warn('Auth Error: ', error));
  }

  componentDidMount() {
    // PushNotification.cancelAllLocalNotifications();
    const fetchData = async () => {
      try {
        const token_res = await AsyncStorage.getItem('@login:');
        this.setState({ token: token_res });
        if (token_res != null) {
          await this.fetchCalendarsFromApi(token_res);
          await this.fetchEventsFromApi(token_res);
        } else {
          console.log('ERROR GETTING AUTH TOKEN');
        }
      } catch (error) {
        console.warn('AsyncStorage - getItem: eventsToRemove', error);
      }
    }
    fetchData();
  }

  fetchCalendarsFromApi = (token)  => {
    const url = this.state.base_url + "calendars/";

    this.setState({ loading: true });

    fetch(url, {
      headers: new Headers({
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json'
      })
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          calendars: res,
          error: null,
          loading: false,
          refreshing: false
        }, () => {
          if (res.detail && res.detail !== 'Invalid token.') {
            this.addCalendars()
          }
        });
      })
      .catch(error => {
        this.setState({ error, loading : false });
      })
  };

  addCalendars() {
    this.state.calendars.forEach( (cal) => {
      RNCalendarEvents.findCalendars()
      .then((result) => {
        if (result.length <= 0) {
          return console.log('No calendar found');
        }

        const appointmentCalendar = this.getAppointmentCalendar(result);
        const medicationCalendar = this.getMedicationCalendar(result);
        const groupSessionCalendar = this.getGroupSessionCalendar(result);
        const indivSessionCalendar = this.getIndivSessionCalendar(result);

        // Calendário consultas já existe
        if (appointmentCalendar && cal.calendar === 'Consultas') { 
          return; 
        }
        // Calendário medicação já existe
        if (medicationCalendar && cal.calendar === 'Medicação') { 
          return; 
        }
        // Calendário sessões de grupo já existe
        if (groupSessionCalendar && cal.calendar === 'Sessões de Grupo') { 
          return; 
        }
        // Calendário sessões individuais já existe
        if (indivSessionCalendar && cal.calendar === 'Sessões Individuais') { 
          return; 
        }

        const calendar = {
          title: cal.calendar,
          color: cal.color,
          entityType: 'event',
          source: {
            name: result[0].source,
            isLocalAccount: true
            // type: result[0].type,
          },
          name: cal.calendar,
          accessLevel: 'read',
          ownerAccount: result[0].source,
        };

        return RNCalendarEvents.saveCalendar(calendar)
          .then(calendarId => console.log('Calendar created successfully!', calendarId))
          .catch(error => console.log('RNCalendarEvents - saveCalendar', error));

      }).catch(err => console.log('RNCalendarEvents - findCalendars', err));
    });
  }

  fetchEventsFromApi = (token)  => {
    const url = this.state.base_url + "events";

    this.setState({ loading: true });

		const encodedValue = encodeURIComponent(
			JSON.stringify({caregivers: [1], patients: []})
		);

    fetch(url + `?users=${encodedValue}`, {
      headers: new Headers({
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json'
      })
    })
      .then(res => res.json())
      .then(res => {
        console.log('Events loaded', res);
        var appts = res.appointments[0];
        var gs = res.sessions[0].filter(s => s.groupSession != null);
        var is = res.sessions[0].filter(s => s.individualSession != null);
        this.setState({
          appointments: appts,
          groupSessions: gs,
          indivSessions: is,
          error: null,
          loading: false,
          refreshing: false
        }, () => {
          this.handleAppointments();
          this.handleGroupSessions();
          this.handleIndivSessions();
        });
      })
      .catch(error => {
        this.setState({ error, loading : false });
      })
  };

  iterateThroughAppointments(eventsToRemove, appointmentCalendar) {
    this.state.appointments.forEach( function(appt) {
      if (eventsToRemove.includes(appt.appointmentPK)) {
        eventsToRemove = eventsToRemove.filter(e => e !== appt.appointmentPK);
      }
      sha256(JSON.stringify(appt)).then( hash => {
        (async () => {
          try {
            handleAppointment(appt, hash, appointmentCalendar);
          } catch (error) {
            console.warn('handleAppointment - outside', error);
          }
        })();
      }).catch(error => console.warn('sha256', error));
    });
    // remover os eventos com as pk's que sobram no eventsToRemove
    eventsToRemove.forEach( function(apptPK) {
      (async () => {
        try {
          const oldEvData = await AsyncStorage.getItem('@appointmentCalendar:' + apptPK);
          RNCalendarEvents.removeEvent(JSON.parse(oldEvData).id)
            .then(() => {
              (async () => { // Remove a key do asyncStorage
                try {
                  await AsyncStorage.removeItem('@appointmentCalendar:' + apptPK);
                } catch (error) {
                  console.warn('AsyncStorage - removeItem', error);
                }
              })();
            })
            .catch(error => {
              console.log('RNCalendarEvents - removeEvent', error);
            });
        } catch (error) {
          console.warn('AsyncStorage - removeItem', error);
        }
      })();
    });
    // fazer um array com as pk's do this.state.appointments
    const newEventsToRemove = this.state.appointments.map( appt => {
      return appt.appointmentPK;
    });
    // colocar no @appointmentCalendar:etr
    (async () => {
      try {
        await AsyncStorage.setItem(
          '@appointmentCalendar:etr',
          JSON.stringify(newEventsToRemove)
        );
      } catch (error) {
        console.warn('AsyncStorage - setItem: newEventsToRemove', error);
      }
    })();
  }

  handleAppointments() {
    RNCalendarEvents.findCalendars()
    .then((result) => {
      const appointmentCalendar = this.getAppointmentCalendar(result);
      const medicationCalendar = this.getMedicationCalendar(result);
      const groupSessionCalendar = this.getGroupSessionCalendar(result);
      const indivSessionCalendar = this.getIndivSessionCalendar(result);

      if (!appointmentCalendar) { return; }
      if (!medicationCalendar) { return; }
      if (!groupSessionCalendar) { return; }
      if (!indivSessionCalendar) { return; }

      (async () => {
        try {
          var eventsToRemove
          const eventsToRemoveStr = await AsyncStorage.getItem('@appointmentCalendar:etr');
          if (eventsToRemoveStr == null) {
            eventsToRemove = [];
            this.iterateThroughAppointments(eventsToRemove, appointmentCalendar);
          } else {
            eventsToRemove = JSON.parse(eventsToRemoveStr);
            this.iterateThroughAppointments(eventsToRemove, appointmentCalendar);
          }
        } catch (error) {
          console.warn('AsyncStorage - getItem: eventsToRemove', error);
        }
      })();

    });
  }

  iterateThroughGroupSessions(eventsToRemove, groupSessionCalendar) {
    this.state.groupSessions.forEach( function(gs) {
      if (eventsToRemove.includes(gs.groupSession.pk)) {
        eventsToRemove = eventsToRemove.filter(e => e !== gs.groupSession.pk);
      }
      sha256(JSON.stringify(gs)).then( hash => {
        (async () => {
          try {
            handleGroupSession(gs, hash, groupSessionCalendar);
          } catch (error) {
            console.warn('handleGroupSession - outside', error);
          }
        })();
      }).catch(error => console.warn('sha256', error));
    });
    // remover os eventos com as pk's que sobram no eventsToRemove
    eventsToRemove.forEach( function(gsPK) {
      (async () => {
        try {
          const oldEvData = await AsyncStorage.getItem('@groupSessionCalendar:' + gsPK);
          RNCalendarEvents.removeEvent(JSON.parse(oldEvData).id)
            .then(() => {
              (async () => { // Remove a key do asyncStorage
                try {
                  await AsyncStorage.removeItem('@groupSessionCalendar:' + gsPK);
                } catch (error) {
                  console.warn('AsyncStorage - removeItem groupSessionCalendar', error);
                }
              })();
            })
            .catch(error => {
              console.log('RNCalendarEvents - removeEvent groupSessionCalendar', error);
            });
        } catch (error) {
          console.warn('AsyncStorage - removeItem groupSessionCalendar', error);
        }
      })();
    });
    // fazer um array com as pk's do this.state.groupSessions
    const newEventsToRemove = this.state.groupSessions.map( gs => {
      return gs.groupSession.pk;
    });
    // colocar no @groupSessionCalendar:etr
    (async () => {
      try {
        await AsyncStorage.setItem(
          '@groupSessionCalendar:etr',
          JSON.stringify(newEventsToRemove)
        );
      } catch (error) {
        console.warn('AsyncStorage - setItem: newEventsToRemove', error);
      }
    })();
  }

  handleGroupSessions() {
    console.log('handleGroupSessions', this.state.groupSessions);
    RNCalendarEvents.findCalendars()
    .then((result) => {
      const groupSessionCalendar = this.getGroupSessionCalendar(result);

      if (!groupSessionCalendar) { return; }

      (async () => {
        try {
          var eventsToRemove
          const eventsToRemoveStr = await AsyncStorage.getItem('@groupSessionCalendar:etr');
          if (eventsToRemoveStr == null) {
            eventsToRemove = [];
            this.iterateThroughGroupSessions(eventsToRemove, groupSessionCalendar);
          } else {
            eventsToRemove = JSON.parse(eventsToRemoveStr);
            this.iterateThroughGroupSessions(eventsToRemove, groupSessionCalendar);
          }
        } catch (error) {
          console.warn('AsyncStorage - getItem groupSessionCalendar: eventsToRemove', error);
        }
      })();

    });
  }

  iterateThroughIndivSessions(eventsToRemove, indivSessionCalendar) {
    this.state.indivSessions.forEach( function(is) {
      if (eventsToRemove.includes(is.individualSession.pk)) {
        eventsToRemove = eventsToRemove.filter(e => e !== is.individualSession.pk);
      }
      sha256(JSON.stringify(is)).then( hash => {
        (async () => {
          try {
            handleIndivSession(is, hash, indivSessionCalendar);
          } catch (error) {
            console.warn('handleIndivSession - outside', error);
          }
        })();
      }).catch(error => console.warn('sha256', error));
    });
    // remover os eventos com as pk's que sobram no eventsToRemove
    eventsToRemove.forEach( function(isPK) {
      (async () => {
        try {
          const oldEvData = await AsyncStorage.getItem('@indivSessionCalendar:' + isPK);
          RNCalendarEvents.removeEvent(JSON.parse(oldEvData).id)
            .then(() => {
              (async () => { // Remove a key do asyncStorage
                try {
                  await AsyncStorage.removeItem('@indivSessionCalendar:' + isPK);
                } catch (error) {
                  console.warn('AsyncStorage - removeItem indivSessionCalendar', error);
                }
              })();
            })
            .catch(error => {
              console.log('RNCalendarEvents - removeEvent indivSessionCalendar', error);
            });
        } catch (error) {
          console.warn('AsyncStorage - removeItem indivSessionCalendar', error);
        }
      })();
    });
    // fazer um array com as pk's do this.state.indivSessions
    const newEventsToRemove = this.state.indivSessions.map( is => {
      return is.individualSession.pk;
    });
    // colocar no @indivSessionCalendar:etr
    (async () => {
      try {
        await AsyncStorage.setItem(
          '@indivSessionCalendar:etr',
          JSON.stringify(newEventsToRemove)
        );
      } catch (error) {
        console.warn('AsyncStorage - setItem: newEventsToRemove', error);
      }
    })();
  }

  handleIndivSessions() {
    console.log('handleIndivSessions', this.state.indivSessions);
    RNCalendarEvents.findCalendars()
    .then((result) => {
      const indivSessionCalendar = this.getIndivSessionCalendar(result);

      if (!indivSessionCalendar) { return; }

      (async () => {
        try {
          var eventsToRemove
          const eventsToRemoveStr = await AsyncStorage.getItem('@indivSessionCalendar:etr');
          if (eventsToRemoveStr == null) {
            eventsToRemove = [];
            this.iterateThroughIndivSessions(eventsToRemove, indivSessionCalendar);
          } else {
            eventsToRemove = JSON.parse(eventsToRemoveStr);
            this.iterateThroughIndivSessions(eventsToRemove, indivSessionCalendar);
          }
        } catch (error) {
          console.warn('AsyncStorage - getItem indivSessionCalendar: eventsToRemove', error);
        }
      })();

    });
  }

  onRefresh() {
    this.setState({refreshing: true});
    const fetchData = async () => {
      await this.fetchCalendarsFromApi(this.state.token);
      await this.fetchEventsFromApi(this.state.token);
    }
    fetchData().then(() => {
      this.setState({refreshing: false});
    });
  }

  openCalendar() {
    if(Platform.OS === 'ios') {
      Linking.openURL('calshow:');
    } else if(Platform.OS === 'android') { 
      Linking.openURL('content://com.android.calendar/time/');
    }
  }

	_listApptEmptyComponent = () => {
		return (
			<View style={styles.emptyList}>
				<Text>Não existem consultas</Text>
			</View>
		)
	}

	_listGSEmptyComponent = () => {
		return (
			<View style={styles.emptyList}>
				<Text>Não existem sessões de grupo</Text>
			</View>
		)
	}

	_listISEmptyComponent = () => {
		return (
			<View style={styles.emptyList}>
				<Text>Não existem sessões individuais</Text>
			</View>
		)
	}

  render() {
    return (

      <View style={{flex:1}}>
        <View style={{flex:0.2}}>
          <Button
            onPress={this.openCalendar}
            title="Abrir calendário"
            buttonStyle={styles.calButton}
            accessibilityLabel="Abrir o calendário para uma visão detalhada dos eventos"
          />

          <View style={{ flex:1, flexDirection: 'row' }}>
            <View style={{flexDirection: 'column', width:'31%'}}>
              <CheckBox
                title='Consultas'
                containerStyle={{marginRight:0, marginTop: 0, height: '100%'}}
                checked={this.state.apptFilterSelected}
                onPress={() => this.setState({apptFilterSelected: !this.state.apptFilterSelected})}
              />
            </View>
            <View style={{flexDirection: 'column', width:'33%'}}>
              <CheckBox
                title='Sessões de grupo'
                containerStyle={{marginRight:0, marginTop: 0, height: '100%'}}
                checked={this.state.gsFilterSelected}
                onPress={() => this.setState({gsFilterSelected: !this.state.gsFilterSelected})}
              />
            </View>
            <View style={{flexDirection: 'column', width:'35%'}}>
              <CheckBox
                title='Sessões individuais'
                containerStyle={{height: '100%', marginTop: 0}}
                checked={this.state.isFilterSelected}
                onPress={() => this.setState({isFilterSelected: !this.state.isFilterSelected})}
              />
            </View>
          </View>
        </View>
        <View style={{flex:0.8}}>
          {
            this.state.apptFilterSelected || (!this.state.apptFilterSelected && !this.state.gsFilterSelected && !this.state.isFilterSelected)
              ?
            <FlatList
              data={this.state.appointments}
              refreshing={this.state.refreshing}
              ListEmptyComponent={this._listApptEmptyComponent}
              onRefresh={() => this.onRefresh()}
              keyExtractor={item => String(item.appointmentPK)}
              renderItem={({ item }) => (
                <Card title="Consulta">
                  <View>
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Especialiade:{' '}</Text>
                      { item.event.data.description }
                    </Text>
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Data:{' '}</Text>
                      { item.occurrenceDate.dayOfMonth + '/' + 
                        item.occurrenceDate.month + '/' + 
                        item.occurrenceDate.year }
                    </Text>
                    {
                      item.event.schedule.times != null
                        ?
                      <Text>
                        <Text style={{fontWeight: 'bold'}}>Hora:{' '}</Text>
                        { item.event.schedule.times[0] }
                      </Text>
                        :
                      <Text>
                        <Text style={{fontWeight: 'bold'}}>Duração:{' '}</Text>
                        todo o dia
                      </Text>
                    }
                    {
                      item.event.schedule.duration != null
                        ?
                      <Text>
                        <Text style={{fontWeight: 'bold'}}>Duração:{' '}</Text>
                        { item.event.schedule.duration + " " +
                          this.durationUnitTranslated(item.event.schedule.durationUnit) }
                      </Text>
                        :
                      null
                    }
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Localização:{' '}</Text>
                      { item.event.data.location }
                    </Text>
                  </View>
                </Card>
              )}
            />
              :
            null
          }
          {
            this.state.gsFilterSelected || (!this.state.apptFilterSelected && !this.state.gsFilterSelected && !this.state.isFilterSelected)
              ?
            <FlatList
              data={this.state.groupSessions}
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
              ListEmptyComponent={this._listGSEmptyComponent}
              keyExtractor={item => String(item.groupSession.pk)}
              renderItem={({ item }) => (
                <Card title="Sessões de Grupo">
                  <View>
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Tema:{' '}</Text>
                      { item.groupSession.theme }
                    </Text>
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Descrição:{' '}</Text>
                      { item.groupSession.description }
                    </Text>
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Objetivos:{' '}</Text>
                    </Text>
                    {
                      item.groupSession.goals.map((g) => (
                        <ListItem
                          key={g}
                          title={<Text>{`\u2022 ${g}`}</Text>}
                        />
                      ))
                    }
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Material necessário:{' '}</Text>
                    </Text>
                    {
                      item.groupSession.materials.map((m) => (
                        <ListItem
                          key={m}
                          title={<Text>{`\u2022 ${m}`}</Text>}
                        />
                      ))
                    }
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Data:{' '}</Text>
                      { item.event.occurrenceDate.dayOfMonth + '/' + 
                        item.event.occurrenceDate.month + '/' + 
                        item.event.occurrenceDate.year }
                    </Text>
                    {
                      item.event.schedule.times != null
                        ?
                      <Text>
                        <Text style={{fontWeight: 'bold'}}>Hora:{' '}</Text>
                        { item.event.schedule.times[0] }
                      </Text>
                        :
                      <Text>
                        <Text style={{fontWeight: 'bold'}}>Duração:{' '}</Text>
                        todo o dia
                      </Text>
                    }
                    {
                      item.event.schedule.duration != null
                        ?
                      <Text>
                        <Text style={{fontWeight: 'bold'}}>Duração:{' '}</Text>
                        { item.event.schedule.duration + " " +
                          this.durationUnitTranslated(item.event.schedule.durationUnit) }
                      </Text>
                        :
                      null
                    }
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Localização:{' '}</Text>
                      { item.event.data.location }
                    </Text>
                  </View>
                </Card>
              )}
            />
              :
            null
          }
          {
            this.state.isFilterSelected || (!this.state.apptFilterSelected && !this.state.gsFilterSelected && !this.state.isFilterSelected)
              ?
            <FlatList
              data={this.state.indivSessions}
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
              ListEmptyComponent={this._listISEmptyComponent}
              keyExtractor={item => String(item.individualSession.pk)}
              renderItem={({ item }) => (
                <Card title="Sessões Individuais">
                  <View>
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Tema:{' '}</Text>
                      { item.individualSession.theme }
                    </Text>
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Descrição:{' '}</Text>
                      { item.individualSession.description }
                    </Text>
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Objetivos:{' '}</Text>
                    </Text>
                    {
                      item.individualSession.goals.map((g) => (
                        <ListItem
                          key={g}
                          title={<Text>{`\u2022 ${g}`}</Text>}
                        />
                      ))
                    }
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Material necessário:{' '}</Text>
                    </Text>
                    {
                      item.individualSession.materials.map((m) => (
                        <ListItem
                          key={m}
                          title={<Text>{`\u2022 ${m}`}</Text>}
                        />
                      ))
                    }
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Data:{' '}</Text>
                      { item.event.occurrenceDate.dayOfMonth + '/' + 
                        item.event.occurrenceDate.month + '/' + 
                        item.event.occurrenceDate.year }
                    </Text>
                    {
                      item.event.schedule.times != null
                        ?
                      <Text>
                        <Text style={{fontWeight: 'bold'}}>Hora:{' '}</Text>
                        { item.event.schedule.times[0] }
                      </Text>
                        :
                      <Text>
                        <Text style={{fontWeight: 'bold'}}>Duração:{' '}</Text>
                        todo o dia
                      </Text>
                    }
                    {
                      item.event.schedule.duration != null
                        ?
                      <Text>
                        <Text style={{fontWeight: 'bold'}}>Duração:{' '}</Text>
                        { item.event.schedule.duration + " " +
                          this.durationUnitTranslated(item.event.schedule.durationUnit) }
                      </Text>
                        :
                      null
                    }
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Localização:{' '}</Text>
                      { item.event.data.location }
                    </Text>
                  </View>
                </Card>
              )}
            />
              :
            null
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
	emptyList: {
		alignItems: 'center',
		marginTop: 20
	},
  calButton: {
    backgroundColor: '#343f4b',
    margin: 10
  }
})
