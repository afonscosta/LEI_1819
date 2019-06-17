import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Image, Card, List, ListItem, CheckBox, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";

export default class HabitsPage extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Habits page',
    drawerIcon: () => (
      <Image
        source={{uri: `https://dummyimage.com/60x60/000/fff.jpg&text=habits`}}
        style={{width: 30, height: 30, borderRadius: 15}}
      />
    )
  }

  constructor(props) {
    super(props);
    this.state  = {
      base_url: 'http://10.0.2.2:8000/cuida24/'
    }
  }

  getDurations(token) {
    const url = this.state.base_url + "activity/duration/";
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json',
      }
    })
      .then(durations => durations.json())
      .then(durations => {
        console.log('durations', durations);
        var durationsReady = durations.map(function(duration) {
          var d = Object.assign({}, duration);
          d.selected = false;
          return d;
        })
        if (durationsReady.length > 0) {
          AsyncStorage.setItem(
            '@durations',
            JSON.stringify(durationsReady)
          )
            .catch((error) => {
              console.warn('AsyncStorage - setItem: durations', error);
            });
        } else {
          this.props.navigation.navigate('SleepLoading');
          // this.fetchMeal(token);
        }
      })
      .catch((error) => {
        console.warn('getDurations: ', error);
      });
  }


  getPhyAct(token) {
    const url = this.state.base_url + 'physicalActivity/';
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json',
      }
    })
      .then(activities => activities.json())
      .then(activities => {
        console.log('activities', activities);
        if (activities.length > 0) {
          AsyncStorage.setItem(
            '@activities',
            JSON.stringify(activities)
          )
            .catch((error) => {
              console.warn('AsyncStorage - setItem: activities', error);
            });
        } else {
          this.props.navigation.navigate('SleepLoading');
          // this.fetchMeal(token);
        }
      })
      .catch((error) => {
        console.warn('getPhyAct: ', error);
      });
  }

  getIndLei(token) {
    const url = this.state.base_url + 'individualLeisure/';
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json',
      }
    })
      .then(activities => activities.json())
      .then(activities => {
        console.log('indivLeisure', activities);
        if (activities.length > 0) {
          AsyncStorage.setItem(
            '@indivLeisure',
            JSON.stringify(activities)
          )
            .catch((error) => {
              console.warn('AsyncStorage - setItem: indivLeisure', error);
            });
        } else {
          this.props.navigation.navigate('SleepLoading');
          // this.fetchMeal(token);
        }
      })
      .catch((error) => {
        console.warn('getIndLei: ', error);
      });
  }

  getSocLei(token) {
    const url = this.state.base_url + 'socialLeisure/';
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json',
      }
    })
      .then(activities => activities.json())
      .then(activities => {
        console.log('socialLeisure', activities);
        if (activities.length > 0) {
          AsyncStorage.setItem(
            '@socialLeisure',
            JSON.stringify(activities)
          )
            .catch((error) => {
              console.warn('AsyncStorage - setItem: socialLeisure', error);
            });
        } else {
          this.props.navigation.navigate('SleepLoading');
          // this.fetchMeal(token);
        }
      })
      .catch((error) => {
        console.warn('getSocLei: ', error);
      });
  }

  async componentDidMount() {
    AsyncStorage.getItem('@login:')
      .then((token) => {
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            this.getPhyAct(token);
            this.getIndLei(token);
            this.getSocLei(token);
            this.getDurations(token);
          }
        });
      })
      .catch((error) => {
        console.warn('AsyncStorage - getItem: login', error);
      });
  }

  render() {
		const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Button
          icon={
            <Image
              source={ require('../assets/goal.png') }
              style={{ width: 100, height: 100 }}
            />
          }
          iconContainerStyle={styles.img}
					onPress={() => this.props.navigation.navigate('WeeklyGoals')}
          title="Objetivos semanais"
          titleStyle={styles.titles}
					buttonStyle={styles.buttonObjSem}
          accessibilityLabel="Apresenta os objetivos para a semana atual."
        />
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.props.navigation.navigate('PhysicalActivity')}
              title="Atividade física"
              titleStyle={styles.titles}
              buttonStyle={styles.button}
              accessibilityLabel="Abrir o calendário para uma visão detalhada dos eventos"
            />
          </View>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.props.navigation.navigate('SocialLeisure')}
              title="Lazer social"
              titleStyle={styles.titles}
              buttonStyle={styles.button}
              accessibilityLabel="Abrir o calendário para uma visão detalhada dos eventos"
            />
          </View>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.props.navigation.navigate('IndivLeisure')}
              title="Lazer individual"
              titleStyle={styles.titles}
              buttonStyle={styles.button}
              accessibilityLabel="Abrir o calendário para uma visão detalhada dos eventos"
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.props.navigation.navigate('Meal')}
              title="Alimentação"
              titleStyle={styles.titles}
              buttonStyle={styles.button}
              accessibilityLabel="Abrir o calendário para uma visão detalhada dos eventos"
            />
          </View>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.props.navigation.navigate('Water')}
              title="Água ingerida"
              titleStyle={styles.titles}
              buttonStyle={styles.button}
              accessibilityLabel="Abrir o calendário para uma visão detalhada dos eventos"
            />
          </View>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.props.navigation.navigate('Nap')}
              title="Sestas"
              titleStyle={styles.titles}
              buttonStyle={styles.button}
              accessibilityLabel="Abrir o calendário para uma visão detalhada dos eventos"
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.props.navigation.navigate('SOS')}
              title="SOS"
              titleStyle={styles.titles}
              buttonStyle={styles.button}
              accessibilityLabel="Abrir o calendário para uma visão detalhada dos eventos"
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonObjSem: {
    backgroundColor: '#F3F3F3',
    borderWidth: 5,
    borderColor: 'transparent',
    padding: 10
  },
  button: {
    backgroundColor: '#F3F3F3',
    borderWidth: 5,
    borderColor: 'transparent',
    padding: 10,
    height: 100
  },
  titles: {
    color: '#343f4b'
  },
  container:{
    flex: 1,
    borderWidth: 5,
    borderColor: 'transparent',
    flexDirection: 'column',
  },
  buttonItem:{
    flexDirection: 'column',
    width: '33%'
  }
})
