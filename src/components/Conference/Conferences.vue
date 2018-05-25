<template>

  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="mb-3 blue-grey lighten-4" v-for="conference in conferences" :key="conference.id">
          <v-container fluid>
            <v-layout row>
              <v-flex xs6 sm4 md3>
                <v-card-media
                  :src="conference.imageUrl"
                  height="150px"
                ></v-card-media>
              </v-flex>
              <v-flex right xs6 sm8 md9>
                <v-card-title primary-title>
                  <div>
                    <h4 class="primary--text headline mb-1">{{conference.title}}</h4>
                    <div>Date: {{conference.date}}</div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat :to="'/conferences/' + conference.id">
                    <v-icon left>arrow_forward</v-icon>
                    View conference
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>


<script>

  export default {
    computed: {
      conferences () {
        return this.$store.getters.loadedConferences
      }
    }
  }
</script>
