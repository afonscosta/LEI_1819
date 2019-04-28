import React from 'react'
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Button,
  Platform,
  Linking,
  FlatList,
  ActivityIndicator
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { StackNavigator } from 'react-navigation';
import RNCalendarEvents from 'react-native-calendar-events';
import { sha256 } from 'react-native-sha256';

const addNewAppointment = async (appt, hash, appointmentCalendar) => {
  console.log('Adicionando evento...', appt);
  RNCalendarEvents.saveEvent(
    appt.details.title, 
    {
      calendarId: appointmentCalendar.id,
      startDate: '2019-04-28T19:26:00.000Z',
      endDate: '2019-04-28T19:26:00.000Z',
      allDay: true,
      location: appt.details.location,
      notes: String(hash),
      description: appt.details.description
      //recurrence: null
    }
  ).then(id => { 
    (async () => {
      try {
        await AsyncStorage.setItem(
          '@appointmentCalendar:' + appt.pk,
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
    const oldEvData = await AsyncStorage.getItem('@appointmentCalendar:' + appt.pk);
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
                await AsyncStorage.removeItem('@appointmentCalendar:' + appt.pk);
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
      base_url: "http://10.0.3.2:8000/cuida24/"
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
    this.fetchCalendarsFromApi();
    this.fetchAppointmentsFromApi();
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

        // Calendário consultas já existe
        if (appointmentCalendar && cal.calendar === 'Consultas') { 
          return; 
        }
        // Calendário medicação já existe
        if (medicationCalendar && cal.calendar === 'Medicação') { 
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

    fetch(url)
      .then(res => res.json())
      .then(res => {

        this.setState({
          appointments: res,
          error: null,
          loading: false,
          refreshing: false
        //}, () => this.handleAppointments());
        }, () => console.log('appointments', this.state.appointments));
      })
      .catch(error => {
        this.setState({ error, loading : false });
      })
  };

  iterateThroughAppointments(eventsToRemove, appointmentCalendar) {
    this.state.appointments.forEach( function(appt) {
      if (eventsToRemove.includes(appt.pk)) {
        eventsToRemove = eventsToRemove.filter(e => e !== appt.pk);
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
      return appt.pk;
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

      if (!appointmentCalendar) { return; }
      if (!medicationCalendar) { return; }

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

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.fetchCalendarsFromApi();
      }
    );
  };

  openCalendar() {
    if(Platform.OS === 'ios') {
      Linking.openURL('calshow:');
    } else if(Platform.OS === 'android') { 
      Linking.openURL('content://com.android.calendar/time/');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Calendar page</Text>
        <Button
          onPress={this.openCalendar}
          title="Abrir calendário"
          color="#841584"
          accessibilityLabel="Abrir o calendário para uma visão detalhada dos eventos"
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