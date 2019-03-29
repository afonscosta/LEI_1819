import Vue from 'vue'
import Router from 'vue-router'
import VueDemo from '@/components/VueDemo'
import Calendario from '@/components/Calendario'
import Habitos from '@/components/Habitos'
import Chat from '@/components/Chat'
import Jogos from '@/components/Jogos'
import Info from '@/components/Info'
import Messages from '@/components/Messages'

Vue.use(Router)

export default new Router({
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
      path: '/messages',
      name: 'messages',
      component: Messages
    }
  ]
})
