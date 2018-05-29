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
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setLoadedConferences(state, payload){
      state.loadedConferences = payload
    },
    addConference (state, payload) {
      state.loadedConferences.push(payload)
    },
    setUser(state, payload){
      state.user = payload
    },
    setLoading(state, payload){
      state.loading = payload
    },
    setError(state, payload){
      state.error = payload
    }
  },
  actions: {
    loadConferences({commit, getters}){
      commit('setLoading', true)
      firebase.database().ref('conferences').once('value')
        .then(data => {
          let conferences = []
          const confObj = data.val()
          console.log(confObj)
          for (let confId in confObj){
            conferences.push({
              id: confId,
              title: confObj[confId].title,
              location: confObj[confId].location,
              imageUrl: confObj[confId].imageUrl,
              description: confObj[confId].description,
              date: confObj[confId].date,
              organiserId: getters.user.id
            })
            commit('setLoading', false)
            commit('setLoadedConferences', conferences)
          }
        })
        .catch(error => {
          commit('setLoading', false)
          console.log(error)
        })
    },
    addConference({commit, getters}, payload) {

      // Action gives you a change to extract attribute of interest to a new payload before calling the mutation
      const conf = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date,
        organiserId: getters.user.id
      }

      // Reach out to firebase and store it
      firebase.database().ref('conferences').push(conf)
        .then(data => {
          commit('addConference', {
            ...conf,
            id: data.key
          })
          console.log(data)
        })
        .catch(error => {
          console.log(error)
        })

    },
    signupUser({commit}, payload) {
      // clear error and start loading
      commit('setError', null)
      commit('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredConferences: []
            }
            commit('setUser', newUser)
          }
        ).catch(
          error => {
            commit('setLoading', true)
            commit('setError', error)
            console.log(error)
          }
      )
    },
    signinUser({commit}, payload) {
      // clear error and start loading
      commit('setError', null)
      commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const existingUser = {
              id: user.uid,
              registeredConferences: []
            }
            commit('setUser', existingUser)
          }
        ).catch(
          error => {
            commit('setLoading', true)
            commit('setError', error)
            console.log(error)
          }
      )
    },
    autoSignin({commit}, payload){
      commit('setUser', {id: payload.uid, registeredConferences: []})
    },
    logout({commit}){
      firebase.auth().signOut()
      commit('setUser', null)
    },
    clearError({commit}){
      commit('setError', null)
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
    },
    loading(state){
      return state.loading
    },
    error(state){
      return state.error
    }
  }
})
