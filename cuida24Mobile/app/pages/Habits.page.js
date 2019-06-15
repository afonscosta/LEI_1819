import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Image, Card, List, ListItem, CheckBox, Button } from 'react-native-elements';
import { getPhyAct } from '../redux/actions/index'
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

class HabitsPage extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Habits page',
    drawerIcon: () => (
      <Image
        source={{uri: `https://dummyimage.com/60x60/000/fff.jpg&text=habits`}}
        style={{width: 30, height: 30, borderRadius: 15}}
      />
    )
  }

  async componentDidMount() {
    AsyncStorage.getItem('@login:')
      .then((token) => {
        const url = "http://10.0.2.2:8000/cuida24/physicalActivity/";
        this.props.getPhyAct({url, token});
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

export default connect(
  null,
  { getPhyAct }
)(HabitsPage);
