import React from 'react'
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Platform,
  Linking,
  FlatList,
  ActivityIndicator
} from 'react-native'
import { Card, List, ListItem, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { StackNavigator } from 'react-navigation';
import RNCalendarEvents from 'react-native-calendar-events';
import { sha256 } from 'react-native-sha256';
import { addMinutes, addDays, addWeeks, addMonths } from 'date-fns';
import PushNotification from 'react-native-push-notification';

const addNewAppointment = async (appt, hash, appointmentCalendar) => {
  console.log('Adicionando evento...', appt);
	var today = new Date();
  appt.event.data.notify.forEach((notif) => {
		var n = new Date(notif);
		console.log('n', n);
		console.log('today', today);
		if (n > today) {
			PushNotification.localNotificationSchedule({
				message: appt.event.data.title + '\n' + 
					appt.event.data.description + '\n' +
					appt.event.data.location,
				date: n
			});
		}
    //PushNotification.localNotification({
      //message: 'Isto é um exemplo de uma notificação!'
    //});
  });
	var rec = null;
	if (appt.event.schedule.duration &&
	appt.event.schedule.durationInDays &&
	appt.event.schedule.durationUnit &&
	!appt.event.schedule.times &&
	!appt.event.schedule.dayOfWeek &&
	!appt.event.schedule.dayOfMonth &&
	!appt.event.schedule.month &&
	!appt.event.schedule.year) {
		rec = 'daily';
	}
	else if (!appt.event.schedule.duration &&
	!appt.event.schedule.durationInDays &&
	!appt.event.schedule.durationUnit &&
	!appt.event.schedule.times &&
	appt.event.schedule.dayOfWeek &&
	!appt.event.schedule.dayOfMonth &&
	!appt.event.schedule.month &&
	!appt.event.schedule.year) {
		rec = 'weekly';
	}
	else if (!appt.event.schedule.duration &&
	!appt.event.schedule.durationInDays &&
	!appt.event.schedule.durationUnit &&
	!appt.event.schedule.times &&
	!appt.event.schedule.dayOfWeek &&
	appt.event.schedule.dayOfMonth &&
	!appt.event.schedule.month &&
	!appt.event.schedule.year) {
		rec = 'monthly';
	}
	else if (!appt.event.schedule.duration &&
	!appt.event.schedule.durationInDays &&
	!appt.event.schedule.durationUnit &&
	!appt.event.schedule.times &&
	!appt.event.schedule.dayOfWeek &&
	appt.event.schedule.dayOfMonth &&
	appt.event.schedule.month &&
	!appt.event.schedule.year) {
		rec = 'yearly';
	}
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
			parseInt(timeSplit[0])+1, // Porquê que preciso de somar 1???
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
  console.log(JSON.stringify(appt.event));
  console.log('startDate', JSON.stringify(startDate));
  console.log('endDate', JSON.stringify(endDate));
	var eventData = {
		calendarId: appointmentCalendar.id,
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
		allDay: appt.event.schedule.times ? false : true,
		location: appt.event.data.location,
		description: appt.event.data.description,
		recurrence: rec
	};

	if (eventData.recurrence == null) {
		delete eventData.recurrence;
	}
	
  RNCalendarEvents.saveEvent(
    appt.event.data.title, 
		eventData
  ).then(id => { 
		(async () => {
			try {
				await AsyncStorage.setItem(
					'@appointmentCalendar:' + appt.appointmentPK,
					JSON.stringify({ 'id': id, 'hash': String(hash) })
				);
			} catch (error) {
				console.warn('AsyncStorage - setItem', error);
			}
		})();
  }).catch(error => console.warn('RNCalendarEvents - saveEvent', error));
}

const handleAppointment = async (appt, hash, appointmentCalendar) => {
  try {
    //await AsyncStorage.clear();
    const oldEvData = await AsyncStorage.getItem('@appointmentCalendar:' + appt.appointmentPK);
    if (oldEvData == null) { // O evento ainda não existe
      addNewAppointment(appt, hash, appointmentCalendar);
    }
    else { // Já tem o evento. Está atualizado?
      var oldEvDataParsed = JSON.parse(oldEvData);
      if (oldEvDataParsed.hash !== hash) { // O evento mudou
        RNCalendarEvents.removeEvent(oldEvDataParsed.id)
          .then(() => {
            (async () => { // Remove a key do asyncStorage
              try {
                await AsyncStorage.removeItem('@appointmentCalendar:' + appt.appointmentPK);
              } catch (error) {
                console.warn('AsyncStorage - removeItem', error);
              }
            })();
            // Adiciona o evento atualizado
            addNewAppointment(appt, hash, appointmentCalendar);
          })
          .catch(error => {
            console.log('RNCalendarEvents - removeEvent', error);
          });
      }
    }
  } catch (error) {
    console.warn('AsyncStorage - handleAppointment', error);
  }
}


export default class CalendarPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      cal_auth: '',
      loading: false,
      appointments: [],
      calendars: [],
      error: null,
      refreshing: false,
      base_url: "http://10.0.2.2:8000/cuida24/",
      users: [{
        name: 'brynn',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
      }]
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
    //PushNotification.cancelAllLocalNotifications();
    const fetchData = async () => {
      await this.fetchCalendarsFromApi();
      await this.fetchAppointmentsFromApi();
    }
    fetchData();
  }

  fetchCalendarsFromApi = ()  => {
    const url = this.state.base_url + "calendars";

    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          calendars: res,
          error: null,
          loading: false,
          refreshing: false
        }, () => this.addCalendars());
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

  fetchAppointmentsFromApi = ()  => {
    const url = this.state.base_url + "appointments";

    this.setState({ loading: true });

		const encodedValue = encodeURIComponent(
			JSON.stringify({caregivers: [1], patients: []})
		);

    fetch(url + `?users=${encodedValue}`)
      .then(res => res.json())
      .then(res => {
        console.log('Appointments loaded', res);
        this.setState({
          appointments: res,
          error: null,
          loading: false,
          refreshing: false
        }, () => this.handleAppointments());
        //}, () => console.log('appointments', this.state.appointments));
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

  onRefresh() {
    this.setState({refreshing: true});
    const fetchData = async () => {
      await this.fetchCalendarsFromApi();
      await this.fetchAppointmentsFromApi();
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

  render() {
    return (
      <View>
        <Button
          onPress={this.openCalendar}
          title="Abrir calendário"
          color="#841584"
          accessibilityLabel="Abrir o calendário para uma visão detalhada dos eventos"
        />

        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={() => this.onRefresh()}
          data={this.state.appointments}
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleView: {
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 5,
    marginLeft: 110
  },
  menuText: {
    paddingLeft: 10,
    color: 'grey'
  },
  locText: {
    paddingLeft: 10,
    color: 'grey',
    marginTop: 6,
    fontSize: 12
  },
  titleText: {
    fontWeight: 'bold'
  },
  restaurantImage: {
    width: 600,
    height: 800
  }
})
