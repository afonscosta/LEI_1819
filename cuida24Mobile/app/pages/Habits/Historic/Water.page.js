import React from 'react';
import { FlatList, StyleSheet, Text, View, Image, Picker } from 'react-native';
import { Card, CheckBox, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

export default class HistoricWaterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      refreshing: false,
      water: [],
      durations: []
    }
  }

  async fetchWater(token) {
    fetch("http://10.0.2.2:8000/cuida24/water", {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json',
      }
    })
      .then(water => water.json())
      .then(water => {
        console.log('water', water);
        if (water.length > 0) {
          AsyncStorage.setItem(
            '@historic:water',
            JSON.stringify(water)
          )
            .then(() => {
              AsyncStorage.getItem('@historic:water')
                .then((water) => {
                  this.setState({
                    water: JSON.parse(water)
                  });
                })
                .catch((error) => {
                  console.warn('AsyncStorage - getItem: historic:water', error);
                });
            })
            .catch((error) => {
              console.warn('AsyncStorage - setItem: historic:water', error);
            });
        }
      })
      .catch((error) => {
        AsyncStorage.getItem('@historic:water')
          .then((water) => {
            this.setState({
              water: JSON.parse(water)
            });
          })
          .catch((error) => {
            console.warn('AsyncStorage - getItem: historic:water', error);
          });
      });
  }

  async componentWillMount() {
    AsyncStorage.getItem('@login:')
      .then((token) => {
        this.fetchWater(token);
        this.setState({ token: token });
      })
      .catch((error) => {
        console.warn('AsyncStorage - getItem: login', error);
      });
  }

  onRefresh() {
    this.setState({refreshing: true});
    const fetchData = async () => {
      await this.fetchWater(this.state.token);
    }
    fetchData().then(() => {
      this.setState({refreshing: false});
    });
  }

	_listEmptyComponent = () => {
		return (
			<View style={styles.emptyList}>
				<Text>Não foi registada água até ao momento.</Text>
			</View>
		)
	}

  render() {
    return (
      <View style={{flex:1}}>
        <View style={{flex: 0.9}}>
          <FlatList
            data={this.state.water}
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
            ListEmptyComponent={this._listEmptyComponent}
            keyExtractor={item => String(item.pk)}
            renderItem={({ item }) => (
              <Card title="Água">
                <View>
                  <Text>
                    <Text style={{fontWeight: 'bold'}}>Data:{' '}</Text>
                    { (new Date(item.date)).toLocaleDateString('en-GB') }
                  </Text>
                  <Text>
                    <Text style={{fontWeight: 'bold'}}>Quantidade:{' '}</Text>
                    { item.water }
                  </Text>
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
            accessibilityLabel="Voltar à página da água."
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
