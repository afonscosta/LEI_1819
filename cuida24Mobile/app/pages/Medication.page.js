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
  ActivityIndicator,
  AsyncStorage
} from 'react-native'
import { StackNavigator } from 'react-navigation';
import RNCalendarEvents from 'react-native-calendar-events';
import { sha256 } from 'react-native-sha256';

const addAppointment = async (appt, hash, appointmentCalendar) => {
  try {
    //await AsyncStorage.clear();
    const oldEvData = await AsyncStorage.getItem('@appointmentCalendar:' + appt.pk);
    console.log('oldEvData', oldEvData);
    if (oldEvData == null) {
      console.log('Adicionando evento...', appt);
      RNCalendarEvents.saveEvent(appt.details.title, {
        calendarId: appointmentCalendar.id,
        startDate: '2019-04-28T19:26:00.000Z',
        endDate: '2019-04-28T19:26:00.000Z',
        allDay: true,
        location: appt.details.location,
        notes: String(hash),
        description: appt.details.description
        //recurrence: null
      })
        .then(id => { 
          (async () => {
            try {
              await AsyncStorage.setItem(
                '@appointmentCalendar:' + appt.pk,
                JSON.stringify({ 'id': id, 'hash': String(hash) })
              ).then(item => console.log('setItem', item));
              console.log('map guardado na storage');
            } catch (error) {
              console.warn('asyncStorage', error);
            }
          })();
          console.log('adicionou ao storage');
        })
        .catch(error => console.warn('Add event Error: ', error));
      console.log('Evento adicionado.');
    }
    else { // Já tem o evento. Está atualizado?
      console.log('o evento já existe!');
      var oldEvDataParsed = JSON.parse(oldEvData);
      console.log('oldEvDataParsed', oldEvDataParsed);
      if (oldEvDataParsed.hash !== hash) { // O evento mudou
        console.log('o evento mudou');
        RNCalendarEvents.removeEvent(oldEvDataParsed.id)
          .then(event => {
            console.log('remove event success', event);
            console.log('Adicionando evento...', appt);
            (async () => {
              try {
                await AsyncStorage.removeItem('@appointmentCalendar:' + appt.pk);
              } catch (error) {
                console.warn('asyncStorage removeItem', error);
              }
            })();
            RNCalendarEvents.saveEvent(appt.details.title, {
              calendarId: appointmentCalendar.id,
              startDate: '2019-04-28T19:26:00.000Z',
              endDate: '2019-04-28T19:26:00.000Z',
              allDay: true,
              location: appt.details.location,
              notes: String(hash),
              description: appt.details.description
              //recurrence: null
            })
              .then(id => { 
                (async () => {
                  try {
                    await AsyncStorage.setItem(
                      '@appointmentCalendar:' + appt.pk,
                      JSON.stringify({ 'id': id, 'hash': String(hash) })
                    );
                    console.log('map guardado na storage');
                  } catch (error) {
                    console.warn('asyncStorage', error);
                  }
                })();
              })
              .catch(error => console.warn('Add event Error: ', error));
            console.log('Evento adicionado.');
          })
          .catch(error => {
            console.log('remove event error', error);
          });
      }
    }
  } catch (error) {
    console.warn('asyncStorage', error);
  }
}

export default class MedicationPage extends React.Component {
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

  addCalendars() {
    this.state.calendars.forEach( function(cal) {
      RNCalendarEvents.findCalendars()
      .then((result) => {
        if (result.length <= 0) {
          return console.log('no calendar found');
        }

        const appointmentCalendar = result.find(c =>
          c.title === 'Consultas' &&
          c.type === 'LOCAL' && 
          c.isPrimary &&
          !c.allowsModifications
        );

        const medicationCalendar = result.find(c => 
          c.title === 'Medicação' &&
          c.type === 'LOCAL' && 
          c.isPrimary &&
          !c.allowsModifications
        );

        if (appointmentCalendar && cal.calendar === 'Consultas') { 
          console.log('não vai inserir calendário das consultas!');
          return; 
        }
        if (medicationCalendar && cal.calendar === 'Medicação') { 
          console.log('não vai inserir calendário da medicação!');
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
        console.log(calendar);
        return RNCalendarEvents.saveCalendar(calendar)
          .then(calendarId => console.log('Calendar created successfully !', calendarId))
          .then(() => console.log(RNCalendarEvents.findCalendars()));
      }).catch(err => console.log('err', err));
    });
  }

  componentDidMount() {
    this.fetchAppointmentsFromApi();
    this.fetchCalendarsFromApi();
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
        }, () => this.saveAppointments());//() => console.log('events', this.state.events));
      })
      .catch(error => {
        this.setState({ error, loading : false });
      })
  };

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

  onPressLearnMore() {
    if(Platform.OS === 'ios') {
      Linking.openURL('calshow:');
    } else if(Platform.OS === 'android') { 
      Linking.openURL('content://com.android.calendar/time/');
    }
  }

  auxSaveAppointments(appointmentCalendar, medicationCalendar) {
    RNCalendarEvents.saveEvent('Consulta 1', {
      calendarId: appointmentCalendar.id,
      startDate: '2019-04-25T19:26:00.000Z',
      endDate: '2019-04-25T19:26:00.000Z',
      location: 'Porto',
      notes: 'Não esquecer da consulta!',
      description: 'descrição',
      recurrence: 'weekly'
    }) 
    RNCalendarEvents.saveEvent('Medicação 1', {
      calendarId: medicationCalendar.id,
      startDate: '2019-04-26T19:26:00.000Z',
      endDate: '2019-04-26T19:26:00.000Z',
      location: 'Braga',
      notes: 'Não esquecer da medicação',
      description: 'descrição',
      recurrence: 'monthly'
    }) 
    if(Platform.OS === 'ios') {
      Linking.openURL('calshow:');
    } else if(Platform.OS === 'android') { 
      Linking.openURL('content://com.android.calendar/time/');
    }
  }

  saveAppointments() {
    RNCalendarEvents.findCalendars()
    .then((result) => {
      console.log('result', result);
      const appointmentCalendar = result.find(c =>
        c.title === 'Consultas' &&
        c.type === 'LOCAL' && 
        c.isPrimary &&
        !c.allowsModifications
      );

      const medicationCalendar = result.find(c => 
        c.title === 'Medicação' &&
        c.type === 'LOCAL' && 
        c.isPrimary &&
        !c.allowsModifications
      );

      if (!appointmentCalendar) { return; }
      if (!medicationCalendar) { return; }

      //auxSaveAppointments(appointmentCalendar, medicationCalendar);
      console.log(this.state.appointments);
      this.state.appointments.forEach( function(appt) {
        sha256(JSON.stringify(appt)).then( hash => {
          (async () => {
            try {
              addAppointment(appt, hash, appointmentCalendar);
            } catch (error) {
              console.warn('outside asyncStorage', error);
            }
          })();
        }).catch(error => console.warn('Hash Error: ', error));
      });
      console.log('depois');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Medication page</Text>
        <Button
          onPress={this.saveAppointments}
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
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
