import React from 'react';
import { FlatList, StyleSheet, Text, View, Image, Picker } from 'react-native';
import { Card, CheckBox, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

export default class HistoricSOSPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      refreshing: false,
      sos: [],
      durations: []
    }
  }

  async fetchSOS(token) {
    fetch("http://10.0.2.2:8000/cuida24/sos", {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json',
      }
    })
      .then(sos => sos.json())
      .then(sos => {
        console.log('sos', sos);
        if (sos.length > 0) {
          AsyncStorage.setItem(
            '@historic:sos',
            JSON.stringify(sos)
          )
            .then(() => {
              AsyncStorage.getItem('@historic:sos')
                .then((sos) => {
                  this.setState({
                    sos: JSON.parse(sos)
                  });
                })
                .catch((error) => {
                  console.warn('AsyncStorage - getItem: historic:sos', error);
                });
            })
            .catch((error) => {
              console.warn('AsyncStorage - setItem: historic:sos', error);
            });
        }
      })
      .catch((error) => {
        AsyncStorage.getItem('@historic:sos')
          .then((sos) => {
            this.setState({
              sos: JSON.parse(sos)
            });
          })
          .catch((error) => {
            console.warn('AsyncStorage - getItem: historic:sos', error);
          });
      });
  }

  async componentWillMount() {
    AsyncStorage.getItem('@login:')
      .then((token) => {
        this.fetchSOS(token);
        this.setState({ token: token });
      })
      .catch((error) => {
        console.warn('AsyncStorage - getItem: login', error);
      });
  }

  onRefresh() {
    this.setState({refreshing: true});
    const fetchData = async () => {
      await this.fetchSOS(this.state.token);
    }
    fetchData().then(() => {
      this.setState({refreshing: false});
    });
  }

	_listEmptyComponent = () => {
		return (
			<View style={styles.emptyList}>
				<Text>Não foram registadas tomas do medicamento SOS até ao momento.</Text>
			</View>
		)
	}

  render() {
    return (
      <View style={{flex:1}}>
        <View style={{flex: 0.9}}>
          <FlatList
            data={this.state.sos}
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
            ListEmptyComponent={this._listEmptyComponent}
            keyExtractor={item => String(item.pk)}
            renderItem={({ item }) => (
              <Card title="Medicamento SOS">
                <View>
                  <Text>
                    <Text style={{fontWeight: 'bold'}}>Data:{' '}</Text>
                    { (new Date(item.date)).toLocaleDateString('en-GB') }
                  </Text>
                  <Text>
                    <Text style={{fontWeight: 'bold'}}>Quantidade:{' '}</Text>
                    { item.sos }
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
            accessibilityLabel="Voltar à página das sestas."
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
