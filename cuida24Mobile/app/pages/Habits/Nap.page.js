import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { postNaps } from '../../redux/actions/index'
import { connect } from 'react-redux';

class NapPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      naps: 0
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

  decNap = () => {
    const n = this.state.naps;
    if (n > 0) {
      this.setState({
        naps: n - 1
      })
    }
  }

  incNap = () => {
    this.setState({
      naps: this.state.naps + 1
    })
  }

  saveNaps = () => {
    const token = this.state.token;
    const naps = this.state.naps;
    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    this.props.postNaps({token, naps, date});
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Fez mais alguma sesta hoje?</Text>
        <Text>{ this.state.naps }</Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.decNap()}
              title="-"
              disabled={ this.state.naps === 0 }
              buttonStyle={styles.buttonNap}
              accessibilityLabel="Retirar uma sesta"
            />
          </View>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.incNap()}
              title="+"
              buttonStyle={styles.buttonNap}
              accessibilityLabel="Acrescentar uma sesta"
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
              onPress={() => this.saveNaps()}
              disabled={ this.state.naps === 0 }
              title="Guardar"
              titleStyle={styles.titles}
              buttonStyle={styles.buttonSave}
              accessibilityLabel="Submete as sestas realizadas."
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
  buttonNap: {
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
  { postNaps }
)(NapPage);
