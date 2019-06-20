import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text, CheckBox, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { postTake } from '../../redux/actions/index';
import { connect } from 'react-redux';
import { addDays, isEqual } from 'date-fns';

class TakePage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      med: null
    }
  }

  async getMedication() {
    AsyncStorage.getItem('@take')
      .then((medStr) => {
        console.log('medStr', medStr);
        var med = JSON.parse(medStr);
        console.log('med', med);
        this.setState({ med: med });
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
    this.getMedication();
  }

  saveTake = (done) => {
    if (done) {
      const token = this.state.token;
      const date = new Date();
      const medication = this.state.med;
      this.props.postTake({token, medication, date});
    }
    AsyncStorage.removeItem('@take')
      .then(() => {
        this.props.navigation.navigate('SleepLoading');
      })
      .catch((error) => {
        console.warn('AsyncStorage - removeItem: take', error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Tomou o medicamento?</Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.saveTake(false)}
              title="Não"
              buttonStyle={styles.buttonOption}
              accessibilityLabel="Volta para a página dos hábitos."
            />
          </View>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.saveTake(true)}
              title="Sim"
              buttonStyle={styles.buttonOption}
              accessibilityLabel="Submete a toma do medicamento."
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
  buttonOption: {
    backgroundColor: '#343f4b'
  },
})

export default connect(
  null,
  { postTake }
)(TakePage);
