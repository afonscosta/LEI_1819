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
