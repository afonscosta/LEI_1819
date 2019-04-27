import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import Calendar from '../components/Calendar.component'

export default class CalendarPage extends Component {
  static navigationOptions = {
    drawerLabel: 'Calendar Page',
    drawerIcon: () => (
      <Image
        source={{uri: `https://dummyimage.com/60x60/000/fff.jpg&text=calendar`}}
        style={{width: 30, height: 30, borderRadius: 15}}
      />
    )
  }

  render() {
    return (
      <Calendar />
    );
  }
}
