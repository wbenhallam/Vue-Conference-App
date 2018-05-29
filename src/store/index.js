import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({

  state: {
    loadedConferences: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    registerUserForConferenceMut(state, payload){
      const targetConfId = payload.id
      if(state.user.registeredConferences.findIndex(confId => confId === targetConfId) >= 0){
        return
      }
      state.user.registeredConferences.push(targetConfId)
      state.user.registrationKeys[targetConfId] = payload.registrationKey
    },
    unregisterUserFromConferenceMut(state, payload){
      const registeredConferences = state.user.registeredConferences
      registeredConferences.splice(registeredConferences.findIndex(confId => confId === payload), 1)
      Reflect.deleteProperty(state.user.registrationKeys, payload)
    },
    setLoadedConferences(state, payload){
      state.loadedConferences = payload
    },
    addConference (state, payload) {
      state.loadedConferences.push(payload)
    },
    updateConference(state, payload){
      const conference = state.loadedConferences.find(conference => {
        return conference.id === payload.id
      })
      if(payload.title){
        conference.title = payload.title
      }
      if(payload.description){
        conference.description = payload.description
      }
      if(payload.date){
        conference.date = payload.date
      }
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
    registerUserForConference({commit, getters}, payload){
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id).child('/registration/')
        .push(payload)
        .then(data => {
          commit('setLoading', false)
          commit('registerUserForConferenceMut', {id: payload, registrationKey: data.key})
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    unregisterUserFromConference({commit, getters}, payload){
      commit('setLoading', true)
      if(!getters.user.registrationKeys)
        return
      const registrationKey = getters.user.registrationKeys[payload]
      console.log(getters.user)
      firebase.database().ref('/users/' + getters.user.id).child('/registration/' + registrationKey)
        .remove()
        .then(data => {
          commit('setLoading', false)
          commit('unregisterUserFromConferenceMut', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
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
              organiserId: confObj[confId].organiserId
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
        description: payload.description,
        date: payload.date,
        organiserId: getters.user.id
      }

      // Reach out to firebase and store it
      let imageUrl
      let key
      firebase.database().ref('conferences').push(conf)
        .then(data => {
          key = data.key
          return key
          // console.log(data)
        })
        .then(key => {
          console.log('--> Conference was added')
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref('conferences/' + key + '.' + ext).put(payload.image)
        })
        .then(fileData => {
          console.log('--> Image was stored')
          return fileData.ref.getDownloadURL()
        })
        .then((downloadUrl) => {
          console.log('--> Download Url was generated')
          return firebase.database().ref('conferences').child(key).update({imageUrl: downloadUrl})
        })
        .then(() => {
          console.log('--> Image URL was added to conference')
          commit('addConference', {
            ...conf,
            imageUrl: imageUrl,
            id: key
          })
        })
        .catch(error => {
          console.log(error)
        })

    },
    updateConferenceData({commit}, payload){
      commit('setLoading', true)
      const updateObj = {}
      if(payload.title){
        updateObj.title = payload.title
      }
      if(payload.description){
        updateObj.description = payload.description
      }
      if(payload.date){
        updateObj.date = payload.date
      }

      // call firebase to update record
      firebase.database().ref('conferences').child(payload.id).update(updateObj)
        .then(data => {
          commit('setLoading', false)
          commit('updateConference', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
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
              registeredConferences: [],
              registrationKeys: {}
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
              registeredConferences: [],
              registrationKeys: {}
            }
            commit('setUser', existingUser)
          }
        ).catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
      )
    },
    autoSignin({commit}, payload){
      commit('setUser', {id: payload.uid, registeredConferences: [], registrationKeys: {}})
    },
    fetchUserData({commit, getters}){
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registration/').once('value')
        .then(data => {
          commit('setLoading', false)
          const dataPairs = data.val()
          let conferenceIds = []
          let registrationKeys = {}
          for (let key in dataPairs){
            conferenceIds.push(dataPairs[key])
            registrationKeys[dataPairs[key]] = key
          }
          const updatedUser = {
            id: getters.user.id,
            registeredConferences: conferenceIds,
            registrationKeys: registrationKeys
          }
          console.log(updatedUser)
          commit('setUser', updatedUser)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
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
