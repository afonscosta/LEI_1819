import Vue from 'vue'
import Router from 'vue-router'

// Miscellaneous
import Home from '@/components/Home'
import Login from '@/components/Login'

// Calendar
import Calendar from '@/components/Calendar/Calendar'
import Appointments from '@/components/Calendar/Appointments/Appointments'
import FormAppoint from '@/components/Calendar/Appointments/FormAppoint'
import Notes from '@/components/Calendar/Notes/Notes'
import GroupSession from '@/components/Calendar/GroupSession/GroupSession'

// Medication
import Medicacao from '@/components/Medication/Medicacao'

// Habits
import Habitos from '@/components/Habits/Habitos'

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

export default new Router({
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
      path: '/menuCalendar/formAppoint',
      name: 'formAppoint',
      component: FormAppoint
    },
    {
      path: '/menuCalendar/notes',
      name: 'notes',
      component: Notes
    },
    {
      path: '/menuCalendar/groupSession',
      name: 'groupSession',
      component: GroupSession
    },

    // Medication
    {
      path: '/medicacao',
      name: 'medicacao',
      component: Medicacao
    },

    // Habits
    {
      path: '/habitos',
      name: 'habitos',
      component: Habitos
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
    }
  ]
})
