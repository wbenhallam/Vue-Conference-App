<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h4 class="black--text">{{conference.title}}</h4>
            <template v-if="userIsCreator">
              <v-spacer></v-spacer>
              <EditConferenceDialog :conference="conference"></EditConferenceDialog>
            </template>
          </v-card-title>
          <v-card-media
            :src="conference.imageUrl"
            height="400px"
          ></v-card-media>
          <v-card-text>
            <div class="black--text">{{conference.date}} -- {{conference.location}}</div>
            <div>{{conference.description}}</div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <RegisterDialog
                :conference="conference"
              v-if="userIsAuthenticated && !userIsCreator"></RegisterDialog>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
  export default {
    props: ['id'],
    computed: {
      conference () {
        console.log('--> Id extracted from URL: ' + this.id)
        return this.$store.getters.loadedConference(this.id)
      },
      user(){
        return this.$store.getters.user
      },
      userIsAuthenticated(){
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsCreator () {
        return this.userIsAuthenticated && this.conference.organiserId === this.user.id
      }
    }
  }
</script>
