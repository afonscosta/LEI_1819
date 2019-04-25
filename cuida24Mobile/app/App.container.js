import React from 'react'
import { StyleSheet, View, StatusBar } from 'react-native'
import AppContainer from './routes'

export default class App extends React.Component {
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
