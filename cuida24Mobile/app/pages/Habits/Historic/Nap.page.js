import React from 'react';
import { FlatList, StyleSheet, Text, View, Image, Picker } from 'react-native';
import { Card, CheckBox, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { addDays, isSameDay } from 'date-fns';

export default class HistoricNapPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      refreshing: false,
      nap: [],
      sleep: [],
      durations: []
    }
  }

  async fetchSleep(token) {
    fetch("http://10.0.2.2:8000/cuida24/sleep", {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json',
      }
    })
      .then(sleep => sleep.json())
      .then(sleep => {
        console.log('sleep', sleep);
        if (sleep.length > 0) {
          AsyncStorage.setItem(
            '@historic:sleep',
            JSON.stringify(sleep)
          )
            .then(() => {
              this.setState({
                sleep: sleep
              }, () => { this.fetchNap(token); });
            })
            .catch((error) => {
              console.warn('AsyncStorage - setItem: historic:sleep', error);
            });
        }
      })
      .catch((error) => {
        AsyncStorage.getItem('@historic:sleep')
          .then((sleep) => {
            this.setState({
              sleep: sleep
            }, () => { this.fetchNap(token); });
          })
          .catch((error) => {
            console.warn('AsyncStorage - getItem: historic:sleep', error);
          });
      });

  }

  async fetchNap(token) {
    fetch("http://10.0.2.2:8000/cuida24/nap", {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json',
      }
    })
      .then(nap => nap.json())
      .then(nap => {
        console.log('nap', nap);
        if (nap.length > 0) {
          AsyncStorage.setItem(
            '@historic:nap',
            JSON.stringify(nap)
          )
            .then(() => {
              AsyncStorage.getItem('@historic:nap')
                .then((nap) => {
                  this.setState({
                    nap: JSON.parse(nap)
                  });
                })
                .catch((error) => {
                  console.warn('AsyncStorage - getItem: historic:nap', error);
                });
            })
            .catch((error) => {
              console.warn('AsyncStorage - setItem: historic:nap', error);
            });
        }
      })
      .catch((error) => {
        AsyncStorage.getItem('@historic:nap')
          .then((activities) => {
            this.setState({
              nap: JSON.parse(nap)
            });
          })
          .catch((error) => {
            console.warn('AsyncStorage - getItem: historic:nap', error);
          });
      });
  }

  async componentWillMount() {
    AsyncStorage.getItem('@login:')
      .then((token) => {
        this.fetchSleep(token);
        this.setState({ token: token });
      })
      .catch((error) => {
        console.warn('AsyncStorage - getItem: login', error);
      });
  }

  getNapSameDay(date) {
    if (this.state.nap.length > 0) {
      var dateSleep = new Date(date);
      dateSleep = addDays(dateSleep, 1);
      var nap = this.state.nap.find(n => {
        var dateNap = new Date(n.date);
        console.log('dateSleep', dateSleep);
        console.log('dateNap', dateNap);
        return isSameDay(dateSleep, dateNap);
      });
      if (nap) {
        return nap.naps;
      }
    }
    return 0;
  }

  printDate(date) {
    var date1 = new Date(date);
    var date2 = addDays(date1, 1);
    return date1.toLocaleDateString('en-GB') + ' - ' + 
           date2.toLocaleDateString('en-GB');
  }

  onRefresh() {
    this.setState({refreshing: true});
    const fetchData = async () => {
      await this.fetchSleep(this.state.token);
    }
    fetchData().then(() => {
      this.setState({refreshing: false});
    });
  }

	_listEmptyComponent = () => {
		return (
			<View style={styles.emptyList}>
				<Text>Não foram registadas sestas até ao momento.</Text>
			</View>
		)
	}

  render() {
    return (
      <View style={{flex:1}}>
        <View style={{flex: 0.9}}>
          <FlatList
            data={this.state.sleep}
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
            ListEmptyComponent={this._listEmptyComponent}
            keyExtractor={item => String(item.pk)}
            renderItem={({ item }) => (
              <Card title={ this.printDate(item.date)}>
                <View>
                  <Text>
                    <Text style={{fontWeight: 'bold'}}>Dormiu mais de 7 horas:{' '}</Text>
                    { item.quantity ? "sim" : "não" }
                  </Text>
                  <Text>
                    <Text style={{fontWeight: 'bold'}}>Nº de sestas ({
                      addDays(new Date(item.date), 1).toLocaleDateString('en-GB')
                    }):{' '}</Text>
                    { this.getNapSameDay(item.date) }
                  </Text>
                </View>
              </Card>
            )}
          />
        </View>
        <View style={{flex: 0.1}}>
          <Button
            onPress={() => this.props.navigation.goBack()}
            title="Voltar"
            buttonStyle={styles.backButton}
            accessibilityLabel="Voltar à página das sestas."
          />
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
  backButton: {
    backgroundColor: '#343f4b',
    margin: 10
  }
})
