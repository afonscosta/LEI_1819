import Vue from 'vue'
import Router from 'vue-router'
import VueDemo from '@/components/VueDemo'
import Calendario from '@/components/Calendario'
import Habitos from '@/components/Habitos'
import Chat from '@/components/Chat'
import Jogos from '@/components/Jogos'
import Info from '@/components/Info'
import InfoIadem from '@/components/InfoIadem'
import InfoDemencia from '@/components/InfoDemencia'
import InfoApoio from '@/components/InfoApoio'
import Messages from '@/components/Messages'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: VueDemo
    },
    {
      path: '/calendario',
      name: 'calendario',
      component: Calendario
    },
    {
      path: '/habitos',
      name: 'habitos',
      component: Habitos
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    },
    {
      path: '/jogos',
      name: 'jogos',
      component: Jogos
    },
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
      path: '/messages',
      name: 'messages',
      component: Messages
    }
  ]
})
