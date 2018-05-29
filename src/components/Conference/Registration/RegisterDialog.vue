<template>
  <v-dialog width="300" row justify-center persistent v-model="registerDialog">
    <v-btn slot="activator" class="error" v-if="userIsRegistered">Unregister</v-btn>
    <v-btn slot="activator" class="primary" v-else>Register</v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Registration</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>{{this.userIsRegistered ? 'Are you sure you want to cancel your registration?' : 'Are you sure you want to register for this conference?'}}</v-card-text>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-btn flat @click="registerDialog=false">Cancel</v-btn>
              <v-btn flat class="primary--text" @click="onConfirm">Confirm</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>

      </v-container>
    </v-card>
  </v-dialog>
</template>


<script>

  export default {
    props: ['conference'],
    data(){
      return {
        registerDialog: false,
      }
    },
    computed: {
      userIsAuthenticated(){
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsRegistered(){
        if(!this.userIsAuthenticated)
          return false
        return this.$store.getters.user.registeredConferences.findIndex(confId => {
          return confId === this.conference.id
        }) >= 0

      }
    },
    methods: {
      onConfirm(){

        // Close dialog
        this.registerDialog = false

        // Call store dispatch
        if(this.userIsRegistered){
          this.$store.dispatch('unregisterUserFromConference', this.conference.id)
        }else{
          this.$store.dispatch('registerUserForConference', this.conference.id)
        }

      }
    }
  }
</script>
