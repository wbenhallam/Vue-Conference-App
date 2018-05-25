import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Conferences from '@/components/Conference/Conferences'
import AddConference from '@/components/Conference/AddConference'
import ViewConference from '@/components/Conference/ViewConference'
import Profile from '@/components/User/Profile'
import Signup from '@/components/User/Signup'
import Signin from '@/components/User/Signin'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/conferences/list',
      name: 'Conferences',
      component: Conferences
    },
    {
      path: '/conferences/add',
      name: 'AddConference',
      component: AddConference
    },

    {
      path: '/conferences/:id',
      name: 'Conference',
      props: true,
      component: ViewConference
    },

    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
  ],
  mode: 'history'
})
