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
  }

  render() {
    // const isLoggedIn = this.state.isLoggedIn;
    // let element;

    // if (isLoggedIn) {
    //   element = <AppContainer />;
    // } else {
    //   element = <LoginPage />;
    // }
    
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
