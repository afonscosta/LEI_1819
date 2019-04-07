import Vue from 'vue'
import App from './App'

import store from './store'
import router from './router'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/src/jquery.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import './assets/offcanvas.css'
import 'bootstrap/dist/js/bootstrap.bundle'

import Vuetify from 'vuetify'
import DaySpanVuetify from 'dayspan-vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'dayspan-vuetify/dist/lib/dayspan-vuetify.min.css'

import pt from './assets/locales/pt_br'

import * as firebase from 'firebase'

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyAs5vrgEbT5GFi7_3jV8OmmvbiajNBafew',
  authDomain: 'cuida24-c506e.firebaseapp.com',
  databaseURL: 'https://cuida24-c506e.firebaseio.com',
  projectId: 'cuida24-c506e',
  storageBucket: 'cuida24-c506e.appspot.com',
  messagingSenderId: '85325839979'
}

firebase.initializeApp(config)

Vue.prototype.$messaging = firebase.messaging()

Vue.prototype.$messaging.usePublicVapidKey('BFosE60zC_ILU6009jvOHocZSfp353IRIJ3FOVQ4sULNMhkrfIHlTGU4nGJLbg6j8F-biQqAdeX27bsW-t4VIuI')

navigator.serviceWorker.register('/static/firebase-messaging-sw.js')
  .then((registration) => {
    Vue.prototype.$messaging.useServiceWorker(registration)
  }).catch(err => {
    console.log(err)
  })

Vue.config.productionTip = false

// Vue.use(VueRouter)
Vue.use(BootstrapVue)

Vue.use(Vuetify)

Vue.use(DaySpanVuetify, {
  data:
  {
    locales: { pt },
    supports: {
      busy: false,
      icon: false
    },
    features: {
      drag: false
    }
  },
  methods: {
    getDefaultEventColor: () => '#1976d2'
  }
})

const vue = new Vue({
  router,
  store,
  render: h => h(App)
})

vue.$mount('#app')

// Request Permission of Notifications
// messaging.requestPermission().then(() => {
//   console.log('Notification permission granted.')
//   // Get Token
//   messaging.getToken().then((token) => {
//     console.log(token)
//   })
// }).catch((err) => {
//   console.log('Unable to get permission to notify.', err)
// })
