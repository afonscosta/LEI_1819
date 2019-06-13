import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

export default class SocialLeisurePage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Social Leisure Page</Text>
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
})
