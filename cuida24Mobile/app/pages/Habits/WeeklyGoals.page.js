import React from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Card } from 'react-native-elements';

export default class WeeklyGoalsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      loading: false,
      goals: [],
      error: null,
      refreshing: false,
      base_url: "http://10.0.2.2:8000/cuida24/"
    }
  }

  fetchGoals = async (token)  => {
    const url = this.state.base_url + "goal/list_goals_caregiver/";

    this.setState({ loading: true });

    fetch(url, {
      headers: new Headers({
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json'
      })
    })
      .then(res => res.json())
      .then(res => {
        console.log('goals', res);
        this.setState({
          goals: res,
          error: null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading : false });
      })
  };

  componentDidMount () {
    AsyncStorage.getItem('@login:')
      .then((token_res) => {
        this.setState({ token: token_res }, () => {
          this.fetchGoals(token_res);
        });
      })
      .catch((error) => {
        console.warn('AsyncStorage - getItem: token', error);
      });
  }

  onRefresh() {
    this.setState({refreshing: true});
    this.fetchGoals(this.state.token).then(() => {
      this.setState({refreshing: false});
    });
  }

	_listPrescEmptyComponent = () => {
		return (
			<View style={styles.emptyList}>
				<Text>Não existem objetivos semanais</Text>
			</View>
		)
	}

  render() {
    const goals = this.state.goals
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={Object.keys(this.state.goals)}
          refreshing={this.state.refreshing}
          onRefresh={() => this.onRefresh()}
          ListEmptyComponent={this._listPrescEmptyComponent}
          keyExtractor={item => String(item)}
          renderItem={({ item }) => (
            <Card title={goals[item].type}>
              <View>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Objetivo:{' '}</Text>
                  { goals[item].goal }
                </Text>
                <Text>
                  <Text style={{fontWeight: 'bold'}}>Realizado:{' '}</Text>
                  { goals[item].realized }
                </Text>
              </View>
            </Card>
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
	emptyList: {
		alignItems: 'center',
		marginTop: 20
	},
  calButton: {
    backgroundColor: '#343f4b',
    margin: 10
  }
})
