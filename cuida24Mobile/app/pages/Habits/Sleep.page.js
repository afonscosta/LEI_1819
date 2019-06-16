import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { postSleep } from '../../redux/actions/index'
import { connect } from 'react-redux';
import { addDays, subDays, differenceInDays } from 'date-fns';

class SleepPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      sleepLess7: false,
      sleepMore7: false,
      remainSleep: []
    }
  }

  async processLastSleep() {
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    AsyncStorage.getItem('@sleep')
      .then((lastSleepStr) => {
        console.log('lastSleepStr', lastSleepStr);
        var remainSleep = [];
        if (lastSleepStr) {
          var lastSleep = new Date(JSON.parse(lastSleepStr).lastSleep);
          var diff = Math.abs(differenceInDays(lastSleep, today));
          for (var i = 1; i < diff; i++) {
            remainSleep.push(addDays(lastSleep, i));
          }
        } else {
          var yesterday = subDays(today, 1);
          remainSleep.push(yesterday);
        }
        this.setState({ remainSleep: remainSleep });
      })
      .catch((error) => {
        console.warn('AsyncStorage - getItem sleep', error);
      });
  }

  async componentDidMount() {
    AsyncStorage.getItem('@login:')
      .then((token_res) => {
        this.setState({ token: token_res });
      })
      .catch((error) => {
        console.warn('AsyncStorage - getItem: eventsToRemove', error);
      });
    this.processLastSleep();
  }

  setLess7 = () => {
    if (this.state.sleepLess7) {
      this.setState({ sleepLess7: false })
    } else {
      this.setState({ sleepLess7: true, sleepMore7: false })
    }
  }

  setMore7 = () => {
    if (this.state.sleepMore7) {
      this.setState({ sleepMore7: false })
    } else {
      this.setState({ sleepMore7: true, sleepLess7: false })
    }
  }


  saveSleep = () => {
    const token = this.state.token;
    const sleep = this.state.sleepMore7;
    const date = this.state.remainSleep[0].toISOString();
    this.props.postSleep({token, sleep, date});
    AsyncStorage.setItem(
      '@sleep',
      JSON.stringify({ 'lastSleep': this.state.remainSleep[0] })
    )
    .then(() => {
      var remainSleepUpdated = this.state.remainSleep.slice(1);
      this.setState({
        remainSleep: remainSleepUpdated
      }, () => {
        if (this.state.remainSleep.length === 0) {
          this.props.navigation.navigate('MealLoading');
        } else {
          this.setState({
            sleepLess7: false,
            sleepMore7: false
          });
        }
      });
    })
    .catch((error) => {
      console.warn('AsyncStorage - setItem', error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.remainSleep.length > 0
            ?
          <Text>Assinale a opção consoante as horas que dormiu na noite de { this.state.remainSleep[0].toDateString() } para { addDays(this.state.remainSleep[0], 1).toDateString() }</Text>
            :
          null
        }
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.buttonItem}>
            <CheckBox
              title='- 7 horas'
              checked={this.state.sleepLess7}
              onPress={() => this.setLess7()}
            />
          </View>
          <View style={styles.buttonItem}>
            <CheckBox
              title='+ 7 horas'
              checked={this.state.sleepMore7}
              onPress={() => this.setMore7()}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.props.navigation.navigate('App')}
              title="Preencher mais tarde"
              titleStyle={styles.titles}
              buttonStyle={styles.buttonCancel}
              accessibilityLabel="Volta para a página dos hábitos."
            />
          </View>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.saveSleep()}
              disabled={ !this.state.sleepLess7 && !this.state.sleepMore7 }
              title="Guardar"
              titleStyle={styles.titles}
              buttonStyle={styles.buttonSave}
              accessibilityLabel="Submete os alimentos ingeridos."
            />
          </View>
        </View>
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
  buttonItem:{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    borderColor: 'green'
  },
  buttonWater: {
    backgroundColor: '#343f4b',
    borderWidth: 10,
    width: 75,
    height: 75,
    borderRadius: 150,
    borderColor: 'transparent'
  },
  titles: {
    color: '#343f4b'
  },
  buttonCancel: {
    backgroundColor: '#F95F62'
  },
  buttonSave: {
    backgroundColor: '#14D2B8'
  },
})

export default connect(
  null,
  { postSleep }
)(SleepPage);
