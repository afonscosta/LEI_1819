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
import { Card, List, ListItem, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { StackNavigator } from 'react-navigation';
import RNCalendarEvents from 'react-native-calendar-events';
import { sha256 } from 'react-native-sha256';
import { addMinutes, addDays, addWeeks, addMonths } from 'date-fns';
import PushNotification from 'react-native-push-notification';
import 
  RadioForm, 
  {RadioButton, RadioButtonInput, RadioButtonLabel} 
from 'react-native-simple-radio-button';

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

const fetchMedName = async (token, pk) => {
  console.log('token', token);
  console.log('pk', pk);
  return await fetch("http://10.0.2.2:8000/cuida24/medicine/" + pk, {
    headers: new Headers({
      'Authorization': 'Token ' + token,
      'Content-Type': 'application/json'
    })
  })
    .then(res => res.json())
    .then(res => {
      console.log('med before return', res.activeSubs);
      return res.activeSubs;
    })
    .catch(error => {
      this.setState({ error, loading : false });
    })
}

const fetchMedsNames = async (t, prescriptions) => {
  return await Promise.all(
    prescriptions.map( async presc => {
      var name = await fetchMedName(t, presc.prescription.medicine);
      return ({pk: presc.prescription.medicine, name: name});
    })
  )
}

const fetchAuthorName = async (token, pk) => {
  console.log('token', token);
  console.log('pk', pk);
  return await fetch("http://10.0.2.2:8000/cuida24/backoffice_user/" + pk, {
    headers: new Headers({
      'Authorization': 'Token ' + token,
      'Content-Type': 'application/json'
    })
  })
    .then(res => res.json())
    .then(res => {
      console.log('author before return', res.info.name);
      return res.info.name;
    })
    .catch(error => {
      this.setState({ error, loading : false });
    })
}

const fetchAuthorsNames = async (t, prescriptions) => {
  return await Promise.all(
    prescriptions.map( async presc => {
      var name = await fetchAuthorName(t, presc.prescription.author);
      return ({pk: presc.prescription.author, name: name});
    })
  )
}

const addNewPrescription = async (token, presc, hash, medicationCalendar, eventID, meds) => {
  console.log('Adicionando prescrição...', presc);
	var today = new Date();
	var rec = parseSchedule(presc);
  console.log('medicamentos', meds);
  console.log('medicine pk', presc.prescription.medicine);
  var med = meds.find(m => m.pk == presc.prescription.medicine);
  if (med != null) { med = med.name; }
  else { med = 'desconhecido'; }
  presc.event.data.notify.forEach((notif) => {
		var n = new Date(notif);
		if (n > today || rec) {
      var repeatType = null;
      if (rec === 'daily') {
        repeatType = 'day';
      } else if (rec === 'weekly') {
        repeatType = 'week';
      }
      if (repeatType) {
        PushNotification.localNotificationSchedule({
          id: String(presc.prescription.pk),
          message: 'Medicamento: ' + med + '\n' +
            'Quantidade: ' + presc.prescription.quantity + ' ml/mg' + '\n' +
            'Via de administração: ' + presc.event.data.description + '\n' +
            'Hora: ' + presc.event.schedule.times[0],
          date: n,
          repeatType: repeatType
        });
      } else {
        PushNotification.localNotificationSchedule({
          id: String(presc.prescription.pk),
          message: 'Medicamento: ' + med + '\n' +
            'Quantidade: ' + presc.prescription.quantity + ' ml/mg' + '\n' +
            'Via de administração: ' + presc.event.data.description + '\n' +
            'Hora: ' + presc.event.schedule.times[0],
          date: n
        });
      }
		}
  });
	var allDay = true;
	var startDate = new Date(
    presc.occurrenceDate.year,
    presc.occurrenceDate.month-1, // Porque os meses são de 0 a 11
    presc.occurrenceDate.dayOfMonth+1
  )
	var endDate = new Date(
    presc.occurrenceDate.year,
    presc.occurrenceDate.month-1, // Porque os meses são de 0 a 11
    presc.occurrenceDate.dayOfMonth+1
  )
	var timeSplit = ["00", "00", "00"];
	if (presc.event.schedule.times) {
		allDay = false;
		timeSplit = presc.event.schedule.times[0].split(":");
		startDate = new Date(
			presc.occurrenceDate.year,
			presc.occurrenceDate.month-1, // Porque os meses são de 0 a 11
			presc.occurrenceDate.dayOfMonth,
			parseInt(timeSplit[0]),
			parseInt(timeSplit[1]),
			parseInt(timeSplit[2])
		);
		if (presc.event.schedule.durationUnit == "minutes") {
			endDate = addMinutes(startDate, presc.event.schedule.duration);
		}
		else if (presc.event.schedule.durationUnit == "days") {
			endDate = addDays(startDate, presc.event.schedule.duration);
		}
		else if (presc.event.schedule.durationUnit == "weeks") {
			endDate = addWeeks(startDate, presc.event.schedule.duration);
		}
		else if (presc.event.schedule.durationUnit == "months") {
			endDate = addMonths(startDate, presc.event.schedule.duration);
		}
	}
	else {
		endDate = startDate;
	}
	var eventData = {
		calendarId: medicationCalendar.id,
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
		allDay: presc.event.schedule.times ? false : true,
		location: presc.event.data.location,
		description: 'Medicamento: ' + med + '\n' +
      'Quantidade: ' + presc.prescription.quantity + 'ml/mg' + '\n' +
      'Via de administração: ' + presc.event.data.description + '\n' +
      'Hora: ' + presc.event.schedule.times[0],
		recurrence: rec
	};

  if (eventID) { // Para fazer update do event
    eventData.id = eventID;
  }

	if (eventData.recurrence == null) {
		delete eventData.recurrence;
	}
	
  RNCalendarEvents.saveEvent(
    presc.event.data.title, 
		eventData
  ).then(id => { 
		(async () => {
			try {
				await AsyncStorage.setItem(
					'@medicationCalendar:' + presc.prescription.pk,
					JSON.stringify({ 'id': id, 'hash': String(hash) })
				);
			} catch (error) {
				console.warn('AsyncStorage - setItem', error);
			}
		})();
  }).catch(error => console.warn('RNCalendarEvents - saveEvent', error));
}

const handlePrescription = async (token, presc, hash, medicationCalendar, meds) => {
  AsyncStorage.getItem('@medicationCalendar:' + presc.prescription.pk)
    .then((oldEvData) => {
      if (oldEvData == null) { // O evento ainda não existe
        addNewPrescription(token, presc, hash, medicationCalendar, null, meds);
      }
      else { // Já tem o evento. Está atualizado?
        var oldEvDataParsed = JSON.parse(oldEvData);
        if (oldEvDataParsed.hash !== hash) { // O evento mudou
          // Remove a key do asyncStorage
          AsyncStorage.removeItem('@medicationCalendar:' + presc.prescription.pk)
            .then(() => {
              PushNotification.cancelLocalNotifications({id: String(presc.prescription.pk)});
              // Adiciona o evento atualizado
              addNewPrescription(token, presc, hash, medicationCalendar, oldEvDataParsed.id, meds);
            })
            .catch((error) => {
              console.warn('AsyncStorage - removeItem', error);
            });
        }
      }
    })
    .catch((error) => {
      console.warn('AsyncStorage - handlePrescription', error);
    });
}

export default class MedicationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      cal_auth: '',
      token: '',
      loading: false,
      prescriptions: [],
      meds: [],
      authors: [],
      calendars: [],
      error: null,
      refreshing: false,
      base_url: "http://10.0.2.2:8000/cuida24/"
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
          await this.fetchPrescriptionsFromApi(token_res);
        } else {
          console.log('ERROR GETTING AUTH TOKEN');
        }
      } catch (error) {
        console.warn('AsyncStorage - getItem: token', error);
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

  fetchPrescriptionsFromApi = (token)  => {
    const url = this.state.base_url + "prescriptions/";

    this.setState({ loading: true });

    fetch(url, {
      headers: new Headers({
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json'
      })
    })
      .then(res => res.json())
      .then(res => {
        console.log('Prescriptions loaded', res);
        this.setState({
          prescriptions: res,
          meds: [],
          error: null,
          loading: false,
          refreshing: false
        }, () => {
          this.fetchMedsNames();
          this.fetchAuthorsNames();
          // this.handlePrescriptions();
        });
      })
      .catch(error => {
        this.setState({ error, loading : false });
      })
  };


  fetchMedsNames() {
    fetchMedsNames(this.state.token, this.state.prescriptions)
      .then(meds => {
        console.log('Meds loaded', meds);
        this.setState({
          meds: meds,
        }, () => {
          this.handlePrescriptions();
        })
      })
  }

  fetchAuthorsNames() {
    fetchAuthorsNames(this.state.token, this.state.prescriptions).then(authors => {
      console.log('authors loaded', authors);
      this.setState({
        authors: authors,
      })
    })
  }

  handlePrescriptions() {
    RNCalendarEvents.findCalendars()
    .then((result) => {
      const medicationCalendar = this.getMedicationCalendar(result);

      if (!medicationCalendar) { return; }

      (async () => {
        try {
          var eventsToRemove
          const eventsToRemoveStr = await AsyncStorage.getItem('@medicationCalendar:etr');
          if (eventsToRemoveStr == null) {
            eventsToRemove = [];
            this.iterateThroughPrescriptions(eventsToRemove, medicationCalendar);
          } else {
            eventsToRemove = JSON.parse(eventsToRemoveStr);
            this.iterateThroughPrescriptions(eventsToRemove, medicationCalendar);
          }
        } catch (error) {
          console.warn('AsyncStorage - getItem: eventsToRemove', error);
        }
      })();

    });
  }

  iterateThroughPrescriptions(eventsToRemove, medicationCalendar) {
    const t = this.state.token;
    const meds = this.state.meds;
    this.state.prescriptions.forEach( function(presc) {
      if (eventsToRemove.includes(presc.prescription.pk)) {
        eventsToRemove = eventsToRemove.filter(e => e !== presc.prescription.pk);
      }
      sha256(JSON.stringify(presc)).then( hash => {
        (async () => {
          try {
            handlePrescription(t, presc, hash, medicationCalendar, meds);
          } catch (error) {
            console.warn('handleAppointment - outside', error);
          }
        })();
      }).catch(error => console.warn('sha256', error));
    });
    // remover os eventos com as pk's que sobram no eventsToRemove
    eventsToRemove.forEach( function(prescPK) {
      (async () => {
        try {
          const oldEvData = await AsyncStorage.getItem('@medicationCalendar:' + prescPK);
          RNCalendarEvents.removeEvent(JSON.parse(oldEvData).id)
            .then(() => {
              // Remove a key do asyncStorage
              AsyncStorage.removeItem('@medicationCalendar:' + prescPK)
                .then(() => {
                  PushNotification.cancelLocalNotifications({id: String(prescPK)});
                })
                .catch((error) => {
                  console.warn('AsyncStorage - removeItem', error);
                });
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
    const newEventsToRemove = this.state.prescriptions.map( presc => {
      return presc.prescription.pk;
    });
    // colocar no @medicationCalendar:etr
    (async () => {
      try {
        await AsyncStorage.setItem(
          '@medicationCalendar:etr',
          JSON.stringify(newEventsToRemove)
        );
      } catch (error) {
        console.warn('AsyncStorage - setItem: newEventsToRemove', error);
      }
    })();
  }

  onRefresh() {
    this.setState({refreshing: true});
    const fetchData = async () => {
      await this.fetchCalendarsFromApi(this.state.token);
      await this.fetchPrescriptionsFromApi(this.state.token);
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

	_listPrescEmptyComponent = () => {
		return (
			<View style={styles.emptyList}>
				<Text>Não existem prescrições</Text>
			</View>
		)
	}

  _parseScheduleRepetition = event => {
    var rec = null;
    if (event.event.schedule.duration &&
    event.event.schedule.durationInDays === 0 &&
    event.event.schedule.durationUnit &&
    !event.event.schedule.dayOfWeek &&
    !event.event.schedule.dayOfMonth &&
    !event.event.schedule.month &&
    !event.event.schedule.year) {
      return (
        <Text>diariamente</Text>
      )
    }
    else if (!event.event.schedule.durationInDays &&
    event.event.schedule.dayOfWeek &&
    !event.event.schedule.dayOfMonth &&
    !event.event.schedule.month &&
    !event.event.schedule.year) {
      return (
        <Text>semanalmente</Text>
      )
    }
    else if (!event.event.schedule.durationInDays &&
    !event.event.schedule.dayOfWeek &&
    event.event.schedule.dayOfMonth &&
    !event.event.schedule.month &&
    !event.event.schedule.year) {
      return (
        <Text>mensalmente</Text>
      )
    }
    else if (!event.event.schedule.durationInDays &&
    !event.event.schedule.dayOfWeek &&
    event.event.schedule.dayOfMonth &&
    event.event.schedule.month &&
    !event.event.schedule.year) {
      return (
        <Text>anualmente</Text>
      )
    }
    return (
      <Text>Sem repetição</Text>
    )
  }

  _getMedName = pk => {
    console.log('meds', this.state.meds);
    var med = this.state.meds.find(m => m.pk == pk);
    if (med != null) {
      console.log('name', med);
      return (
        <Text>{med.name}</Text>
      )
    }
    return (
      <Text></Text>
    )
  }

  _getAuthorName = pk => {
    console.log('authors', this.state.authors);
    var author = this.state.authors.find(a => a.pk == pk);
    if (author != null) {
      console.log('name', author);
      return (
        <Text>{author.name}</Text>
      )
    }
    return (
      <Text></Text>
    )
  }

  render() {
    return (
      <View>
        <Button
          onPress={this.openCalendar}
          title="Abrir calendário"
					buttonStyle={styles.calButton}
          accessibilityLabel="Abrir o calendário para uma visão detalhada dos eventos"
        />

        <FlatList
          data={this.state.prescriptions}
          refreshing={this.state.refreshing}
          onRefresh={() => this.onRefresh()}
          ListEmptyComponent={this._listPrescEmptyComponent}
          keyExtractor={item => String(item.prescription.pk)}
          renderItem={({ item }) => (
            <Card title="Prescrição">
              <View>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Medicamento:{' '}</Text>
                  { this._getMedName(item.prescription.medicine) }
                </Text>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Quantidade:{' '}</Text>
                  { item.prescription.quantity + ' ml/mg' }
                </Text>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Via de administração:{' '}</Text>
                  { item.event.data.description }
                </Text>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Data da primeira toma:{' '}</Text>
                  { item.occurrenceDate.dayOfMonth + '/' + 
                    item.occurrenceDate.month + '/' + 
                    item.occurrenceDate.year }
                </Text>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Repetição:{' '}</Text>
                  { this._parseScheduleRepetition(item) }
                </Text>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Hora:{' '}</Text>
                  { item.event.schedule.times[0] }
                </Text>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Prescrição realizada por:{' '}</Text>
                  { this._getAuthorName(item.prescription.author) }
                </Text>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Data de prescrição:{' '}</Text>
                  { (new Date(item.prescription.date)).toLocaleDateString('en-GB') }
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
	emptyList: {
		alignItems: 'center',
		marginTop: 20
	},
  calButton: {
    backgroundColor: '#343f4b',
    margin: 10
  }
})
