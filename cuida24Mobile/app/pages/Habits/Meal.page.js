import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

export default class MealPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      base_url: "http://10.0.2.2:8000/cuida24/",
      water: 0,
      apptFilterSelected: false,
      gsFilterSelected: false,
      isFilterSelected: false,
			types: [
				{ value: 'CB', title: 'Carnes Brancas', selected: false },
				{ value: 'FT', title: 'Fruta', selected: false },
				{ value: 'VG', title: 'Vegetais', selected: false },
				{ value: 'FB', title: 'Fibras', selected: false },
				{ value: 'PC', title: 'Pré-cozinhados', selected: false },
        { value: 'RF', title: 'Refrigerantes', selected: false },
				{ value: 'AL', title: 'Alcool', selected: false }
			]
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

  saveMeal = () => {
    const url = this.state.base_url + "meal/";
    var meal = this.state.types.filter((m) => m.selected).map((m) => {
			return m.value
		})
    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + this.state.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        meal: meal
      }),
    }).then(() => {
      this.props.navigation.goBack();
    }).catch((error) => {
      console.log('POST meal: ', error);
    });
  }


  render() {
    const types = this.state.types;
    return (
      <View style={styles.container}>
				<Text>Almoço</Text>
				{
					types.map((type, key) => (
            <CheckBox
              key={key}
              title={type.title}
              checked={type.selected}
              onPress={() => 
								this.setState(({types}) => ({
									types: [
										...types.slice(0,key),
										{
											...types[key],
											selected: !type.selected,
										},
										...types.slice(key+1)
									]
								}))
							}
          	/>
          ))
				}

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
              onPress={() => this.saveMeal()}
              title="Guardar"
              titleStyle={styles.titles}
              buttonStyle={styles.buttonSave}
              accessibilityLabel="Submete os copos de água inseridos."
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
