import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { postSleep } from '../../redux/actions/index'
import { connect } from 'react-redux';

class SleepPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      base_url: "http://10.0.2.2:8000/cuida24/",
      sleepLess7: false,
      sleepMore7: false
    }
  }

  async componentDidMount() {
    AsyncStorage.getItem('@login:')
      .then((token_res) => {
        this.setState({ token: token_res });
      })
      .catch((error) => {
        console.warn('AsyncStorage - getItem: eventsToRemove', error);
      });
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
    const url = this.state.base_url + "sleep/";
    const token = this.state.token;
    const sleep = this.state.sleepMore7;
    this.props.postSleep({url, token, sleep});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Assinale a opção consoante as horas que dormiu na última noite</Text>
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
        <Button
          onPress={() => this.saveSleep()}
          disabled={ !this.state.sleepLess7 && !this.state.sleepMore7 }
          title="Guardar"
          titleStyle={styles.titles}
          buttonStyle={styles.buttonSave}
          accessibilityLabel="Submete os alimentos ingeridos."
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
