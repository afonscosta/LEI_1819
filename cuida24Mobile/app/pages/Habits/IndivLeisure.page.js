import React from 'react';
import { StyleSheet, Text, View, Image, Picker } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { postIndLei } from '../../redux/actions/index'
import { connect } from 'react-redux';

class IndivLeisurePage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      durations: null,
      activities: [],
      act: 1
    }
  }

  async getDurations() {
    AsyncStorage.getItem('@durations')
      .then((durationsStr) => {
        console.log('durationsStr', durationsStr);
        var durations = JSON.parse(durationsStr);
        console.log('durations', durations);
        this.setState({ durations: durations });
      })
      .catch((error) => {
        console.warn('AsyncStorage - getItem durations', error);
      });
  }

  async componentWillMount() {
    AsyncStorage.getItem('@login:')
      .then((token_res) => {
        AsyncStorage.getItem('@indivLeisure')
          .then((activities) => {
            this.setState({
              token: token_res,
              activities: JSON.parse(activities)
            });
          })
          .catch((error) => {
            console.warn('AsyncStorage - getItem: indivLeisure', error);
          });
      })
      .catch((error) => {
        console.warn('AsyncStorage - getItem: login', error);
      });
    this.getDurations();
  }

  areBothSelected() {
    if (this.state.durations != null) {
      const duration = this.state.durations.filter((d) => d.selected)
      return duration.length > 0 && this.state.act !== null;
    }
    return false;
  }

  setDuration(value) {
    durations = this.state.durations.map((d) => {
      if (d.value === value) {
        d.selected = true;
      } else {
        d.selected = false;
      }
			return d;
		});
    this.setState({ durations: durations });
  }

  saveIndLei = () => {
    const token = this.state.token;
    const date = new Date();
    const type = 'LI';
    const act = this.state.act;
    var duration = this.state.durations.filter((d) => d.selected).map((d) => {
			return d.value
		});
    duration = duration[0];
    this.props.postIndLei({token, date, type, act, duration});
    this.props.navigation.goBack();
  }

  render() {
    const durations = this.state.durations;
    return (
      <View style={styles.container}>
        <Text>Duração:</Text>
        {
          this.state.durations
            ?
          durations.map((duration, key) => (
            <CheckBox
              key={key}
              title={duration.title}
              checked={duration.selected}
              onPress={() => this.setDuration(duration.value) }
            />
          ))
            :
          null
        }
        {
          this.state.activities && this.state.activities.length > 0
            ?
          <Picker
            selectedValue={this.state.act}
            style={{height: 50, width: '50%'}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({act: itemValue})
            }>
            {
              this.state.activities.map((act, key) => (
                <Picker.Item key={key} label={act.description} value={act.pk} />
              ))
            }
          </Picker>
            :
          null
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
              onPress={() => this.saveIndLei()}
              disabled={ !this.areBothSelected() }
              title="Guardar"
              titleStyle={styles.titles}
              buttonStyle={styles.buttonSave}
              accessibilityLabel="Submete a atividade individual realizada."
            />
          </View>
        </View>
        <Button
          onPress={() => this.props.navigation.navigate('HistoricIndivLeisure')}
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
    width: '33%',
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
  { postIndLei }
)(IndivLeisurePage);
