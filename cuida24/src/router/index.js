import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store'

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
import InfoIadem from '@/components/Info/InfoIadem'
import InfoDemencia from '@/components/Info/InfoDemencia'
import InfoApoio from '@/components/Info/InfoApoio'

Vue.use(Router)

const router = new Router({
  routes: [
    // Miscellaneous
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
      component: Calendar
    },
    {
      path: '/menuCalendar/appointments',
      name: 'appointments',
      component: Appointments
    },
    {
      path: '/menuCalendar/appointments/formAppoint',
      name: 'formAppoint',
      component: FormAppoint
    },
    {
      path: '/menuCalendar/notes',
      name: 'notes',
      component: Notes
    },
    {
      path: '/menuCalendar/sessions',
      name: 'sessions',
      component: Session
    },
    {
      path: '/menuCalendar/sessions/formSession',
      name: 'formSession',
      component: FormSession
    },
    {
      path: '/menuCalendar/sessions/evaluation',
      name: 'evaluation',
      component: UserEvaluation
    },

    // Medication
    {
      path: '/medication',
      name: 'medication',
      component: Medication
    },
    {
      path: '/medication/prescriptions',
      name: 'prescriptions',
      component: Prescriptions
    },
    {
      path: '/medication/prescriptions/formPrescription',
      name: 'formPrescription',
      component: FormPrescription
    },

    // Habits
    {
      path: '/habits',
      name: 'habits',
      component: Habits
    },
    {
      path: '/habits/goals',
      name: 'goals',
      component: Goals
    },
    {
      path: '/habits/activities',
      name: 'activities',
      component: Activities
    },

    // Chat
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    },

    // Games
    {
      path: '/jogos',
      name: 'jogos',
      component: Jogos
    },

    // Information
    {
      path: '/info',
      name: 'info',
      component: Info
    },
    {
      path: '/info-iadem',
      name: 'info-iadem',
      component: InfoIadem
    },
    {
      path: '/info-demencia',
      name: 'info-demencia',
      component: InfoDemencia
    },
    {
      path: '/info-apoio',
      name: 'info-apoio',
      component: InfoApoio
    },
    {
      path: '/registar',
      name: 'registar',
      component: Registar
    }
  ]
})

export default router
