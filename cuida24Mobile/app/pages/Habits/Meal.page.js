import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text, CheckBox, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { postMeal } from '../../redux/actions/index'
import { connect } from 'react-redux';
import { addDays, isEqual } from 'date-fns';

class MealPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      dateNextMeal: null,
      lastToFill: null,
      done: false,
			types: [
				{ value: 'CB', title: 'Carnes Brancas', selected: false },
				{ value: 'FT', title: 'Fruta', selected: false },
				{ value: 'VG', title: 'Vegetais', selected: false },
				{ value: 'FB', title: 'Fibras', selected: false },
				{ value: 'PC', title: 'Pré-cozinhados', selected: false },
        { value: 'RF', title: 'Refrigerantes', selected: false },
				{ value: 'AL', title: 'Álcool', selected: false },
				{ value: 'OU', title: 'Outro', selected: false }
			]
    }
  }

  lastToFill() {
    var today = new Date();
    var h = today.getHours();
    if (h > 19) {
      today.setHours(19);
    } else if (h > 16) {
      today.setHours(16);
    } else if (h > 12) {
      today.setHours(12);
    } else if (h > 10) {
      today.setHours(10);
    } else if (h > 7) {
      today.setHours(7);
    }
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    this.setState({ lastToFill: today });
  }

  todayBreakfast() {
    var today = new Date();
    var h = today.getHours();
    if (h > 7) {
      today.setHours(7);
    };
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    return today;
  }

  nextMeal(meal) {
    var h = meal.getHours();
    if (h === 7) {
      meal.setHours(10);
    } else if (h === 10) {
      meal.setHours(12);
    } else if (h === 12) {
      meal.setHours(16);
    } else if (h === 16) {
      meal.setHours(19);
    } else if (h === 19) {
      meal.setHours(7);
      meal = addDays(meal, 1);
    };
    return meal;
  }

  async getNextMeal() {
    AsyncStorage.getItem('@meal')
      .then((lastMealStr) => {
        var nextMeal = null;
        if (lastMealStr) {
          var lastMeal = new Date(JSON.parse(lastMealStr).lastMeal);
          nextMeal = this.nextMeal(lastMeal);
        } else { // Register for the first time
          nextMeal = this.todayBreakfast();
        }
        this.setState({ dateNextMeal: nextMeal });
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
    this.getNextMeal();
    this.lastToFill();
  }

  typeMeal() {
    const h = this.state.dateNextMeal.getHours();
    if (h === 7) {
      return { value: 'PA', text: 'Pequeno-almoço'};
    } else if (h === 10) {
      return { value: 'LM', text: 'Lanche da manhã' };
    } else if (h === 12) {
      return { value: 'AL', text: 'Almoço' };
    } else if (h === 16) {
      return { value: 'LT', text: 'Lanche da tarde' };
    } else if (h === 19) {
      return { value: 'JT', text: 'Jantar' };
    };
  }

  processDone() {
    var done = this.state.done;
    const type = this.typeMeal().value;
    if (['PA', 'LM', 'LT'].includes(type)) {
      return done;
    }
    return true;
  }

  saveMeal = () => {
    const token = this.state.token;
    const date = this.state.dateNextMeal;
    const done = this.processDone();
    const type = this.typeMeal().value;
    var food = this.state.types.filter((m) => m.selected).map((m) => {
			return m.value
		});
    console.log('done', done);
    this.props.postMeal({token, type, food, done, date});
    AsyncStorage.setItem(
      '@meal',
      JSON.stringify({ 'lastMeal': date })
    )
      .then(() => {
        if (isEqual(this.state.dateNextMeal, this.state.lastToFill)) {
          this.props.navigation.navigate('App');
        } else {
          this.setState({
            dateNextMeal: this.nextMeal(this.state.dateNextMeal),
            done: false,
            types: [
              { value: 'CB', title: 'Carnes Brancas', selected: false },
              { value: 'FT', title: 'Fruta', selected: false },
              { value: 'VG', title: 'Vegetais', selected: false },
              { value: 'FB', title: 'Fibras', selected: false },
              { value: 'PC', title: 'Pré-cozinhados', selected: false },
              { value: 'RF', title: 'Refrigerantes', selected: false },
              { value: 'AL', title: 'Alcool', selected: false }
            ]
          });
        }
      })
      .catch((error) => {
        console.warn('AsyncStorage - setItem: lastMeal', error);
      });
  }

  isOneSelected() {
    var selected = this.state.types.filter((m) => m.selected);
    return selected.length > 0;
  }


  render() {
    const types = this.state.types;
    const done = this.state.done;
    return (
      <View style={styles.container}>
        {
          this.state.dateNextMeal !== null && ['PA', 'LM', 'LT'].includes(this.typeMeal().value)
            ?
          <Text>Comeu o {this.typeMeal().text.toLowerCase()}?</Text>
            :
          null
        }
        {
          this.state.dateNextMeal !== null && ['PA', 'LM', 'LT'].includes(this.typeMeal().value)
            ?
          <Text>({this.state.dateNextMeal.toLocaleDateString('en-GB')})</Text>
            :
          null
        }
        {
          this.state.dateNextMeal !== null && ['PA', 'LM', 'LT'].includes(this.typeMeal().value)
            ?
          <CheckBox
            title='Tomei'
            checked={done}
            onPress={() => 
              this.setState({done: !done})
            }
          />
            :
          null
        }
        {
          this.state.dateNextMeal !== null && !['PA', 'LM', 'LT'].includes(this.typeMeal().value)
            ?
          <Text h3>{this.typeMeal().text}</Text>
            :
          null
        }
        {
          this.state.dateNextMeal !== null && !['PA', 'LM', 'LT'].includes(this.typeMeal().value)
            ?
          <Text>({this.state.dateNextMeal.toLocaleDateString('en-GB')})</Text>
            :
          null
        }
        {
          this.state.dateNextMeal !== null && !['PA', 'LM', 'LT'].includes(this.typeMeal().value)
            ?
          <Text>Selecione os tipos de alimentos que comeu na refeição.</Text>
            :
          null
        }
        {
          this.state.dateNextMeal !== null && !['PA', 'LM', 'LT'].includes(this.typeMeal().value)
            ?
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
            :
          null
        }

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
              onPress={() => this.saveMeal()}
              disabled={ !this.isOneSelected() }
              title="Guardar"
              titleStyle={styles.titles}
              buttonStyle={styles.buttonSave}
              accessibilityLabel="Submete os copos de água inseridos."
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
  { postMeal }
)(MealPage);
