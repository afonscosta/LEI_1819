import React from 'react'
import { StyleSheet, View, StatusBar } from 'react-native'
import AppContainer from './routes'
import {LocaleConfig} from 'react-native-calendars';
import LoginPage from './pages/Login.page';

LocaleConfig.locales['pt'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul.','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sabádo'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab']
};

LocaleConfig.defaultLocale = 'pt';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isLoggedIn: false};

    var PushNotification = require('react-native-push-notification');
    PushNotification.configure({

        // (required) Called when a remote or local notification is opened or received
        onNotification: function(notification) {
            console.log( 'NOTIFICATION:', notification );
        },

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
            alert: true,
            badge: true,
            sound: true
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
          * (optional) default: true
          * - Specified if permissions (ios) and token (android and ios) will requested or not,
          * - if not, you must call PushNotificationsHandler.requestPermissions() later
          */
        requestPermissions: true,
    });
  }

  render() {
    return (
      <AppContainer />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
})
