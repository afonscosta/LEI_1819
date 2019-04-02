import Vue from 'vue'
import App from '@/App.vue'

import store from '@/store' 
import router from '@/router'

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

import fr from './assets/locales/fr'
import en from './assets/locales/en'
import ca from './assets/locales/ca'
import nl from './assets/locales/nl'
import pt from './assets/locales/pt_br'


Vue.config.productionTip = false

// Vue.use(VueRouter)
Vue.use(BootstrapVue)

Vue.use(Vuetify);

Vue.use(DaySpanVuetify, {
  data:
  {
    locales: { en, fr, nl, ca, pt }
  },
  methods: {
    getDefaultEventColor: () => '#1976d2'
  }
});

const vue = new Vue({
  router,
  store,
  render: h => h(App)
})

vue.$mount('#app')
