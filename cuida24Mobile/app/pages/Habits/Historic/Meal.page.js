import React from 'react';
import { FlatList, StyleSheet, Text, View, Image, Picker } from 'react-native';
import { ListItem, Card, CheckBox, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

export default class HistoricMealPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      refreshing: false,
      meal: [],
      types: []
    }
  }

  async fetchMeal(token) {
    fetch("http://10.0.2.2:8000/cuida24/meal", {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json',
      }
    })
      .then(meal => meal.json())
      .then(meal => {
        console.log('meal', meal);
        if (meal.length > 0) {
          AsyncStorage.setItem(
            '@historic:meal',
            JSON.stringify(meal)
          )
            .then(() => {
              AsyncStorage.getItem('@meals')
                .then((types) => {
                  console.log('TYPES', types);
                  this.setState({
                    types: JSON.parse(types),
                    meal: meal
                  });
                })
                .catch((error) => {
                  console.warn('AsyncStorage - getItem: fetch success historic:meal', error);
                });
            })
            .catch((error) => {
              console.warn('AsyncStorage - setItem: historic:meal', error);
            });
        }
      })
      .catch((error) => {
        AsyncStorage.getItem('@historic:meal')
          .then((meal) => {
            AsyncStorage.getItem('@meals')
              .then((types) => {
                this.setState({
                  meal: JSON.parse(meal),
                  types: JSON.parse(types)
                });
              });
          })
          .catch((error) => {
            console.warn('AsyncStorage - getItem: historic:meal', error);
          });
      });
  }

  async componentWillMount() {
    AsyncStorage.getItem('@login:')
      .then((token) => {
        this.fetchMeal(token);
        this.setState({ token: token });
      })
      .catch((error) => {
        console.warn('AsyncStorage - getItem: login', error);
      });
  }

  parseMealType(value) {
    if (value === 'PA') {
      return "Pequeno-almoço";
    } else if (value === 'LM') {
      return "Lanche da manhã";
    } else if (value === 'AL') {
      return "Almoço";
    } else if (value === 'LT') {
      return "Lanche da tarde";
    } else if (value === 'JT') {
      return "Jantar";
    }
    return "Tipo de refeição desconhecida.";
  }

  parseFood(value) {
    var type = this.state.types.find(t => t.value === value);
    if (type) {
      return type.title;
    }
    return "Alimento desconhecido.";
  }

  onRefresh() {
    this.setState({refreshing: true});
    const fetchData = async () => {
      await this.fetchMeal(this.state.token);
    }
    fetchData().then(() => {
      this.setState({refreshing: false});
    });
  }

	_listEmptyComponent = () => {
		return (
			<View style={styles.emptyList}>
				<Text>Não foram registadas sestas até ao momento.</Text>
			</View>
		)
	}

  render() {
    return (
      <View style={{flex:1}}>
        <View style={{flex: 0.9}}>
          <FlatList
            data={this.state.meal}
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
            ListEmptyComponent={this._listEmptyComponent}
            keyExtractor={item => String(item.pk)}
            renderItem={({ item }) => (
              <Card title={ this.parseMealType(item.type) }>
                <View>
                  <Text>
                    <Text style={{fontWeight: 'bold'}}>Data:{' '}</Text>
                    { (new Date(item.date)).toLocaleDateString('en-GB') }
                  </Text>
                  <Text>
                    <Text style={{fontWeight: 'bold'}}>Realizada:{' '}</Text>
                    { item.done ? "sim" : "não" }
                  </Text>
                  {
                    item.food.length > 0
                      ?
                    <Text>
                      <Text style={{fontWeight: 'bold'}}>Constituintes:{' '}</Text>
                    </Text>
                      :
                    null
                  }
                  {
                    item.food.length > 0
                      ?
                    item.food.map((f) => (
                      <ListItem
                        contentContainerStyle={{padding: 0, paddingLeft: 10}}
                        containerStyle={{padding: 0, paddingLeft: 10}}
                        key={f}
                        title={<Text>{`\u2022 ${this.parseFood(f)}`}</Text>}
                      />
                    ))
                      :
                    null
                  }
                </View>
              </Card>
            )}
          />
        </View>
        <View style={{flex: 0.1}}>
          <Button
            onPress={() => this.props.navigation.goBack()}
            title="Voltar"
            buttonStyle={styles.backButton}
            accessibilityLabel="Voltar à página dos hábitos."
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
	emptyList: {
		alignItems: 'center',
		marginTop: 20
	},
  backButton: {
    backgroundColor: '#343f4b',
    margin: 10
  }
})
