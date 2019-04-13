import * as firebase from 'firebase'

const setupNotifications = {
  // Initialize Firebase
  config: {
    apiKey: 'AIzaSyAs5vrgEbT5GFi7_3jV8OmmvbiajNBafew',
    authDomain: 'cuida24-c506e.firebaseapp.com',
    databaseURL: 'https://cuida24-c506e.firebaseio.com',
    projectId: 'cuida24-c506e',
    storageBucket: 'cuida24-c506e.appspot.com',
    messagingSenderId: '85325839979'
  },

  initFirebase () {
    firebase.initializeApp(this.config)

    let messaging = firebase.messaging()

    messaging.usePublicVapidKey('BFosE60zC_ILU6009jvOHocZSfp353IRIJ3FOVQ4sULNMhkrfIHlTGU4nGJLbg6j8F-biQqAdeX27bsW-t4VIuI')

    navigator.serviceWorker.register('/static/firebase-messaging-sw.js')
      .then((registration) => {
        messaging.useServiceWorker(registration)
      }).catch(err => {
        console.log(err)
      })
    return messaging
  }
}

export default setupNotifications
