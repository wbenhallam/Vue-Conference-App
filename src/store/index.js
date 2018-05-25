import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'


Vue.use(Vuex)

export const store = new Vuex.Store({

  state: {
    loadedConferences: [
      {imageUrl: 'https://www.omm.com/~/media/images/site/locations/beijing_780x520px.ashx', id: '1', title: 'SPE conference in Beijing', date: '2018-07-25', location: 'Beijing, China'},
      {imageUrl: 'https://img.huffingtonpost.com/asset/5a396b641600002800c50e5f.jpg?ops=scalefit_720_noupscale', id: '2', title: 'AAPG conference in SLC', date: '2018-07-15', location: 'Salt Lake City, Utah. USA'}
    ],
    user: null
  },
  mutations: {
    addConference (state, payload) {
      state.loadedConferences.push(payload)
    },
    setUser(state, payload){
      state.user = payload
    }
  },
  actions: {
    addConference({commit}, payload) {

      // Action gives you a change to extract attribute of interest to a new payload before calling the mutation
      const conf = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date,
        id: '5'
      }

      // Reach out to firebase and store it
      commit('addConference', conf)
    },
    signupUser({commit}, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = {
              id: user.uid,
              registeredConferences: []
            }
            commit('setUser', newUser)
          }
        ).catch(
          error => {
            console.log(error)
          }
      )
    },
    signinUser({commit}, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const existingUser = {
              id: user.uid,
              registeredConferences: []
            }
            commit('setUser', existingUser)
          }
        ).catch(
          error => {
            console.log(error)
          }
      )
    }
  },
  getters: {
    loadedConferences(state){
      return state.loadedConferences.sort((confA, confB) => {
        return confA.date > confB.date
      })
    },
    featuredConferences(state, getters){
      return getters.loadedConferences.slice(0,5)
    },
    loadedConference(state){
      return (confId) => {
        return state.loadedConferences.find((conference) => {
          return conference.id === confId
        })
      }
    },
    user(state) {
      return state.user
    }
  }
})
