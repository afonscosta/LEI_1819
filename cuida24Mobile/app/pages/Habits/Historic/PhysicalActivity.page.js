import React from 'react';
import { FlatList, StyleSheet, Text, View, Image, Picker } from 'react-native';
import { Card, CheckBox, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

export default class HistoricPhysicalActivityPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      base_url: 'http://10.0.2.2:8000/cuida24/',
      refreshing: false,
      activities: [],
      durations: []
    }
  }

  async fetchPhysicalActs(token) {
    const url = this.state.base_url + "activity/";
    fetch("http://10.0.2.2:8000/cuida24/activity?type=AF", {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json',
      }
    })
      .then(activities => activities.json())
      .then(activities => {
        console.log('activities', activities);
        if (activities.length > 0) {
          AsyncStorage.setItem(
            '@physicalActs',
            JSON.stringify(activities)
          )
            .then(() => {
              AsyncStorage.getItem('@durations')
                .then((durations) => {
                  this.setState({
                    durations: JSON.parse(durations),
                    activities: activities
                  });
                })
                .catch((error) => {
                  console.warn('AsyncStorage - getItem: physicalActs', error);
                });
            })
            .catch((error) => {
              console.warn('AsyncStorage - setItem: physicalActs', error);
            });
        }
      })
      .catch((error) => {
        AsyncStorage.getItem('@durations')
          .then((durations) => {
            AsyncStorage.getItem('@physicalActs')
              .then((activities) => {
                this.setState({
                  durations: JSON.parse(durations),
                  activities: JSON.parse(activities)
                });
              })
              .catch((error) => {
                console.warn('AsyncStorage - getItem: physicalActs', error);
              });
          });
      });
  }

  async componentWillMount() {
    AsyncStorage.getItem('@login:')
      .then((token) => {
        this.fetchPhysicalActs(token);
        this.setState({ token: token });
      })
      .catch((error) => {
        console.warn('AsyncStorage - getItem: login', error);
      });
  }

  parseDuration(value) {
    var duration = this.state.durations.find(d => d.value === value);
    if (duration) {
      return duration.title;
    }
    return "Duração não foi encontrada.";
  }

  onRefresh() {
    this.setState({refreshing: true});
    const fetchData = async () => {
      await this.fetchPhysicalActs(this.state.token);
    }
    fetchData().then(() => {
      this.setState({refreshing: false});
    });
  }

	_listEmptyComponent = () => {
		return (
			<View style={styles.emptyList}>
				<Text>Não existem atividades físicas registadas.</Text>
			</View>
		)
	}

  render() {
    const durations = this.state.durations;
    return (
      <View style={{flex:1}}>
        <View style={{flex: 0.9}}>
          <FlatList
            data={this.state.activities}
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
            ListEmptyComponent={this._listEmptyComponent}
            keyExtractor={item => String(item.pk)}
            renderItem={({ item }) => (
              <Card title={ item.act }>
                <View>
                  <Text>
                    <Text style={{fontWeight: 'bold'}}>Data:{' '}</Text>
                    { (new Date(item.date)).toLocaleDateString('en-GB') }
                  </Text>
                  <Text>
                    <Text style={{fontWeight: 'bold'}}>Duração:{' '}</Text>
                    { this.parseDuration(item.duration) }
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
            accessibilityLabel="Voltar à página da atividade física."
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
