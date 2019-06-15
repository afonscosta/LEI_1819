import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { postSOS } from '../../redux/actions/index'
import { connect } from 'react-redux';

class SOSPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      sos: 0,
      date: null
    }
  }

  async componentDidMount() {
    AsyncStorage.getItem('@login:')
      .then((token_res) => {
        var today = new Date();
        this.setState({ token: token_res, date: today });
      })
      .catch((error) => {
        console.warn('AsyncStorage - getItem: eventsToRemove', error);
      });
  }

  decSOS = () => {
    const n = this.state.sos;
    if (n > 0) {
      this.setState({
        sos: n - 1
      })
    }
  }

  incSOS = () => {
    this.setState({
      sos: this.state.sos + 1
    })
  }

  saveSOS = () => {
    const token = this.state.token;
    const sos = this.state.sos;
    const today = this.state.date;
    this.props.postSOS({token, sos, today});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Administrou o medicamenteo SOS mais alguma vez hoje?</Text>
        <Text>{ this.state.sos }</Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.decSOS()}
              title="-"
              disabled={ this.state.sos === 0 }
              buttonStyle={styles.buttonSOS}
              accessibilityLabel="Retirar uma toma"
            />
          </View>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.incSOS()}
              title="+"
              buttonStyle={styles.buttonSOS}
              accessibilityLabel="Acrescentar uma toma"
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.props.navigation.goBack()}
              title="Cancelar"
              titleStyle={styles.titles}
              buttonStyle={styles.buttonCancel}
              accessibilityLabel="Volta para a página dos hábitos."
            />
          </View>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.saveSOS()}
              disabled={ this.state.sos === 0 }
              title="Guardar"
              titleStyle={styles.titles}
              buttonStyle={styles.buttonSave}
              accessibilityLabel="Submete as tomas realizadas."
            />
          </View>
        </View>
        <Button
          onPress={() => alert('Histórico')}
          title="Histórico"
          buttonStyle={styles.buttonHistoric}
          accessibilityLabel="Histórico dos descansos realizados."
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
  buttonSOS: {
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
  buttonHistoric: {
    backgroundColor: '#343f4b'
  },
})

export default connect(
  null,
  { postSOS }
)(SOSPage);
