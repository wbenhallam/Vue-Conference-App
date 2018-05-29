<template>

  <v-container>
    <v-layout row wrap class="mb-3">
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large router to="/conferences/list" class="secondary">View Conferences</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large router to="/conferences/add" class="secondary">Add Conference</v-btn>
      </v-flex>
    </v-layout>

    <v-layout row wrap v-if="loading">
      <v-flex xs10 offset-xs1 class="text-xs-center">
        <v-progress-circular
          :size="100"
          indeterminate
          color="amber"
        ></v-progress-circular>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
          <v-carousel style="cursor: pointer" v-if="!loading">
            <v-carousel-item v-for="item in conferences" :src="item.imageUrl"
                             :key="item.id" v-on:click.native="onLoadConference(item.id)">
              <div class="title">
                {{item.title}}
              </div>
            </v-carousel-item>
          </v-carousel>
      </v-flex>
    </v-layout>

    <v-layout row wrap class="mt-2">
      <v-flex xs12 class="text-xs-center">
        <p>Join this awesome conference</p>
      </v-flex>
    </v-layout>
  </v-container>

</template>


<script>
export default {
  computed: {
    conferences () {
      return this.$store.getters.featuredConferences
    },
    loading () {
      return this.$store.getters.loading
    }

  },
  methods: {
    onLoadConference (id) {
      this.$router.push('/conferences/' + id)
    }
  }
}
</script>



<style scoped>
  .title{
    bottom: 50px;
    background-color: rgba(0,0,0,0.5);
    color: white;
    font-size: 2em;
    padding: 10px;
    margin: auto;

  }

</style>
