import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { postWater } from '../../redux/actions/index'
import { connect } from 'react-redux';

class WaterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      base_url: "http://10.0.2.2:8000/cuida24/",
      water: 0
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

  decWater = () => {
    const w = this.state.water;
    if (w > 0) {
      this.setState({
        water: w - 1
      })
    }
  }

  incWater = () => {
    this.setState({
      water: this.state.water + 1
    })
  }

  saveWater = () => {
    const url = this.state.base_url + "water/";
    const token = this.state.token;
    const water = this.state.water;
    this.props.postWater({url, token, water});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Bebeu mais algum copo de água hoje?</Text>
        <Text>{ this.state.water }</Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.decWater()}
              title="-"
              disabled={ this.state.water === 0 }
              buttonStyle={styles.buttonWater}
              accessibilityLabel="Retirar um copo de água"
            />
          </View>
          <View style={styles.buttonItem}>
            <Button
              onPress={() => this.incWater()}
              title="+"
              buttonStyle={styles.buttonWater}
              accessibilityLabel="Acrescentar um copo de água"
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
              onPress={() => this.saveWater()}
              disabled={ this.state.water === 0 }
              title="Guardar"
              titleStyle={styles.titles}
              buttonStyle={styles.buttonSave}
              accessibilityLabel="Submete os alimentos ingeridos."
            />
          </View>
        </View>
        <Button
          onPress={() => alert('Histórico')}
          title="Histórico"
          buttonStyle={styles.buttonHistoric}
          accessibilityLabel="Histórico dos copos de água ingeridos."
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
  buttonHistoric: {
    backgroundColor: '#343f4b'
  },
})

export default connect(
  null,
  { postWater }
)(WaterPage);
