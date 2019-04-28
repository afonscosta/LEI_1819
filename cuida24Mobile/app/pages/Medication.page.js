import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

export default class MedicationPage extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Medication Page',
    drawerIcon: () => (
      <Image
        source={{uri: `https://dummyimage.com/60x60/000/fff.jpg&text=medication`}}
        style={{width: 30, height: 30, borderRadius: 15}}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Medication page</Text>
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