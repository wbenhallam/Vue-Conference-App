import Vue from 'vue'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import Vuetify from 'vuetify'
import AlertCmp from './components/Shared/AlertCmp'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/es5/util/colors'
import {store} from './store'

Vue.component('AlertCmp', AlertCmp)

Vue.use(Vuetify, {
  theme: {
    primary: colors.lightBlue.base,
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyCWLEML_NoV-VMgLsT4X8D1-MrpICwc-sI',
      authDomain: 'testproject-201720.firebaseapp.com',
      databaseURL: 'https://testproject-201720.firebaseio.com',
      projectId: 'testproject-201720',
      storageBucket: 'testproject-201720.appspot.com',
    })

    firebase.auth().onAuthStateChanged(user => {
      console.log(user)
      if(user){}{
        console.log(user)
        this.$store.dispatch('autoSignin', user)
      }
    })

    // Initialize loaded conference in store
    this.$store.dispatch('loadConferences')
  }
})
