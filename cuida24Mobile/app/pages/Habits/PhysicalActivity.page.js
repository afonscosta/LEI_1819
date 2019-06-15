import React from 'react';
import { StyleSheet, Text, View, Image, Picker } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { postPhyAct } from '../../redux/actions/index'
import { connect } from 'react-redux';

class PhysicalActivityPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      token: '',
      duration1020: false,
      duration2030: false,
      duration3040: false,
      duration4050: false,
      duration5060: false,
      duration60: false,
      activities: [],
      act: 1
    }
  }

  async componentWillMount() {
    AsyncStorage.getItem('@login:')
      .then((token_res) => {
        AsyncStorage.getItem('@activities')
          .then((activities) => {
            this.setState({
              token: token_res,
              activities: JSON.parse(activities)
            });
          })
          .catch((error) => {
            console.warn('AsyncStorage - getItem: activities', error);
          });
      })
      .catch((error) => {
        console.warn('AsyncStorage - getItem: login', error);
      });
  }

  areBothSelected() {
    return (this.state.duration1020 ||
      this.state.duration2030 ||
      this.state.duration3040 ||
      this.state.duration4050 ||
      this.state.duration5060 ||
      this.state.duration60) && this.state.act !== null;
  }

  setDuration1020 = () => {
    if (this.state.duration1020) {
      this.setState({ duration1020: false })
    } else {
      this.setState({
        duration1020: true,
        duration2030: false,
        duration3040: false,
        duration4050: false,
        duration5060: false,
        duration60: false,
      })
    }
  }

  setDuration2030 = () => {
    if (this.state.duration2030) {
      this.setState({ duration2030: false })
    } else {
      this.setState({
        duration1020: false,
        duration2030: true,
        duration3040: false,
        duration4050: false,
        duration5060: false,
        duration60: false,
      })
    }
  }

  setDuration3040 = () => {
    if (this.state.duration3040) {
      this.setState({ duration3040: false })
    } else {
      this.setState({
        duration1020: false,
        duration2030: false,
        duration3040: true,
        duration4050: false,
        duration5060: false,
        duration60: false,
      })
    }
  }

  setDuration4050 = () => {
    if (this.state.duration4050) {
      this.setState({ duration4050: false })
    } else {
      this.setState({
        duration1020: false,
        duration2030: false,
        duration3040: false,
        duration4050: true,
        duration5060: false,
        duration60: false,
      })
    }
  }

  setDuration5060 = () => {
    if (this.state.duration5060) {
      this.setState({ duration5060: false })
    } else {
      this.setState({
        duration1020: false,
        duration2030: false,
        duration3040: false,
        duration4050: false,
        duration5060: true,
        duration60: false,
      })
    }
  }

  setDuration60 = () => {
    if (this.state.duration60) {
      this.setState({ duration60: false })
    } else {
      this.setState({
        duration1020: false,
        duration2030: false,
        duration3040: false,
        duration4050: false,
        duration5060: false,
        duration60: true,
      })
    }
  }

  parseDuration() {
    if (this.state.duration1020) {
      return "10-20 min";
    } else if (this.state.duration2030) {
      return "20-30 min";
    } else if (this.state.duration3040) {
      return "30-40 min";
    } else if (this.state.duration4050) {
      return "40-50 min";
    } else if (this.state.duration5060) {
      return "50-60 min";
    } else if (this.state.duration60) {
      return "+ 60 min";
    }
  }

  savePhyAct = () => {
    const token = this.state.token;
    const date = new Date();
    const type = 'AF';
    const act = this.state.act;
    const duration = this.parseDuration();
    this.props.postPhyAct({token, date, type, act, duration});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Duração:</Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.buttonItem}>
            <CheckBox
              title='10-20 min'
              checked={this.state.duration1020}
              onPress={() => this.setDuration1020()}
            />
          </View>
          <View style={styles.buttonItem}>
            <CheckBox
              title='20-30 min'
              checked={this.state.duration2030}
              onPress={() => this.setDuration2030()}
            />
          </View>
          <View style={styles.buttonItem}>
            <CheckBox
              title='30-40 min'
              checked={this.state.duration3040}
              onPress={() => this.setDuration3040()}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.buttonItem}>
            <CheckBox
              title='40-50 min'
              checked={this.state.duration4050}
              onPress={() => this.setDuration4050()}
            />
          </View>
          <View style={styles.buttonItem}>
            <CheckBox
              title='50-60 min'
              checked={this.state.duration5060}
              onPress={() => this.setDuration5060()}
            />
          </View>
          <View style={styles.buttonItem}>
            <CheckBox
              title='+ 60 min'
              checked={this.state.duration60}
              onPress={() => this.setDuration60()}
            />
          </View>
        </View>
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
        <Button
          onPress={() => this.savePhyAct()}
          disabled={ !this.areBothSelected() }
          title="Guardar"
          titleStyle={styles.titles}
          buttonStyle={styles.buttonSave}
          accessibilityLabel="Submete a atividade física realizada."
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
})

export default connect(
  null,
  { postPhyAct }
)(PhysicalActivityPage);
