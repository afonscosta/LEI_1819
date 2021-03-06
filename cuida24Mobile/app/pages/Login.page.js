import React from 'react'
import { StyleSheet, Text, View, Image, TextInput, Dimensions, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { isAfter } from 'date-fns';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      base_url: "http://10.0.2.2:8000/cuida24/"
    }
  }

  onPressLoginButton = async () => {
    const url = this.state.base_url + "token/";

    console.log('pedido enviado!!!!!!!!!!!!!!!!!!!!')
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
        console.log(res.token);
        var token = res.token;
        AsyncStorage.setItem('@login:', token)
          .then(() => {
            this.props.navigation.navigate('SleepLoading');
          })
          .catch((error) => {
            console.warn('AsyncStorage - setItem: login', error);
          });
      })
      .catch((error) => {
        console.error(error);
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
              onPress={this.onPressLoginButton}
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
    backgroundColor: '#343F4B',
    alignItems: 'center',
    justifyContent: 'center',
    padding : 20
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#343F4B',
    marginBottom: 10,
    paddingHorizontal: 10
  },
  loginbuttoncontainer: {
    height: 40,
    width: width * .8,
    backgroundColor: '#FFD185',
    paddingVertical: 10
  },
  loginbuttontext: {
    color: '#343F4B',
    textAlign: 'center',
    fontWeight: '700'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 40,
    color: 'rgba(255, 255, 255, 0.9)',
  }
})
