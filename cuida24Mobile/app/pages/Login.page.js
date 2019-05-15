import React from 'react'
import { StyleSheet, Text, View, Image, TextInput, Dimensions, TouchableOpacity, KeyboardAvoidingView } from 'react-native'

export default class LoginPage extends React.Component {
  state = {
    email: '',
    password: '',
    base_url: "http://10.0.3.2:8000/cuida24/"
  }

  onPress = () => {
    const url = this.state.base_url + "token";

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.email,
        password: this.state.password,
      }),
    }).then(res => res.json())
      .then(res => {
        (async () => {
          try {
            await AsyncStorage.setItem(
              '@login:',
              res.token
            );
          } catch (error) {
            console.warn('AsyncStorage - setItem', error);
          }
        })();
      });

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cuida24</Text>

        <Image 
          source={require('../assets/logo-IADem.png')}
          style={styles.logo}
        />

          <KeyboardAvoidingView behavior='padding'>
            <TextInput 
              placeholder='Email'
              style={styles.input}
              returnKeyType='next'
              onSubmitEditing={() => this.passwordInput.focus()}
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={(text) => this.state.email = text}
            />

            <TextInput 
              placeholder='Palavra-passe'
              style={styles.input}
              secureTextEntry
              ref={(input) => this.passwordInput = input}
              onChangeText={(text) => this.state.password = text}
            />

            <TouchableOpacity 
              style={styles.loginbuttoncontainer}
              onPress={this._onPressButton}
            > 
              <Text style={styles.loginbuttontext}>
                ENTRAR
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>    
      </View>
    )
  }
}

var width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#929393',
    alignItems: 'center',
    justifyContent: 'center',
    padding : 20
  },
  linky: {
    fontWeight: 'bold',
    color: '#4C3E54',
    paddingTop: 10
  },
  logo: {
    marginTop: 20,
    marginBottom: 20,
    width: 110,
    height: 100
  },
  input: {
    height: 40,
    width: width * .8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 10,
    paddingHorizontal: 10
  },
  loginbuttoncontainer: {
    height: 40,
    width: width * .8,
    backgroundColor: '#636363',
    paddingVertical: 10
  },
  loginbuttontext: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700'
  }
})
