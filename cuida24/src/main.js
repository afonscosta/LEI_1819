import Vue from 'vue'
import App from './App'

import store from './store'
import router from './router'

import pt from './assets/locales/pt_br'

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

import Datetime from 'vue-datetime'
// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'
import { Settings } from 'luxon'

import Notifications from 'vue-notification'

// import component and stylesheet
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css'

import setupNotifications from '@/assets/firebase_notifications.js'
Vue.prototype.$messaging = setupNotifications.initFirebase()

// see docs for available options
const datepickerOptions = {}

// make sure we can use it in our components
Vue.use(AirbnbStyleDatepicker, datepickerOptions)

Vue.config.productionTip = false

Settings.defaultLocale = 'pt'

// Vue.use(VueRouter)
Vue.use(Datetime)
Vue.use(BootstrapVue)
Vue.use(Vuetify)
Vue.use(Notifications)
Vue.use(DaySpanVuetify, {
  data:
  {
    locales: { pt },
    supports: {
      busy: false,
      icon: false,
      notify: true
    },
    features: {
      drag: false
    }
  },
  methods: {
    getDefaultEventColor: () => '#1976d2',
    getDefaultEventDetails: () => {
      return {
        title: '',
        description: '',
        location: '',
        color: '#1976d2',
        forecolor: '#ffffff',
        calendar: '',
        icon: '',
        notify: []
      }
    }
  }
})

const vue = new Vue({
  router,
  store,
  render: h => h(App)
})

vue.$mount('#app')
