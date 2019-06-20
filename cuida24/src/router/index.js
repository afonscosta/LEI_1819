import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

// Miscellaneous
import Home from '@/components/Home'
import Login from '@/components/Login'
import Registar from '@/components/Registar'

// Calendar
import Calendar from '@/components/Calendar/Calendar'
import Appointments from '@/components/Calendar/Appointments/Appointments'
import FormAppoint from '@/components/Calendar/Appointments/FormAppoint'
import Notes from '@/components/Calendar/Notes/Notes'
import Session from '@/components/Calendar/Session/Session'
import FormSession from '@/components/Calendar/Session/FormSession'
import UserEvaluation from '@/components/Calendar/Session/UserEvaluation'

// Medication
import Medication from '@/components/Medication/Medication'
import Prescriptions from '@/components/Medication/Prescriptions/Prescriptions'
import FormPrescription from '@/components/Medication/Prescriptions/FormPrescription'

// Habits
import Habits from '@/components/Habits/Habits'
import Goals from '@/components/Habits/Goals/Goals'
import Activities from '@/components/Habits/Activities/Activities'

// Chat
import Chat from '@/components/Chat/Chat'

// Games
import Jogos from '@/components/Games/Jogos'

// Information
import Info from '@/components/Info/Info'

Vue.use(Router)

const router = new Router({
  routes: [
    // Miscellaneous
    {
      path: '*',
      name: 'all',
      component: Home
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },

    // Calendar
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },
    {
      path: '/menuCalendar/appointments',
      name: 'appointments',
      component: Appointments,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },
    {
      path: '/menuCalendar/appointments/formAppoint',
      name: 'formAppoint',
      component: FormAppoint,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },
    {
      path: '/menuCalendar/notes',
      name: 'notes',
      component: Notes,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },
    {
      path: '/menuCalendar/sessions',
      name: 'sessions',
      component: Session,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },
    {
      path: '/menuCalendar/sessions/formSession',
      name: 'formSession',
      component: FormSession,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },
    {
      path: '/menuCalendar/sessions/evaluation',
      name: 'evaluation',
      component: UserEvaluation,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },

    // Medication
    {
      path: '/medication',
      name: 'medication',
      component: Medication,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },
    {
      path: '/medication/prescriptions',
      name: 'prescriptions',
      component: Prescriptions,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },
    {
      path: '/medication/prescriptions/formPrescription',
      name: 'formPrescription',
      component: FormPrescription,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },

    // Habits
    {
      path: '/habits',
      name: 'habits',
      component: Habits,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },
    {
      path: '/habits/goals',
      name: 'goals',
      component: Goals,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },
    {
      path: '/habits/activities',
      name: 'activities',
      component: Activities,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },

    // Chat
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },

    // Games
    {
      path: '/jogos',
      name: 'jogos',
      component: Jogos,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },

    // Information
    {
      path: '/info',
      name: 'info',
      component: Info
    },
    {
      path: '/registar',
      name: 'registar',
      component: Registar,
      beforeEnter: (to, from, next) => {
        if (store.getters['login/accesstoken']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    }
  ]
})

export default router
