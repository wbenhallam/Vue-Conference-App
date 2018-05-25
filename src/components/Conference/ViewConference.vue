<template>

  <v-container>
    <v-layout row wrap>
      <v-flex sm12>
        <v-card>
          <v-card-title>
            <h4 class="black--text">{{conference.title}}</h4>
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
              <v-btn class="primary">Register</v-btn>
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
        return this.$store.getters.loadedConference(this.id)
      }
    }
  }
</script>
