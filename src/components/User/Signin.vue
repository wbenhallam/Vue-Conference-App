<template>
  <v-container>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <AlertCmp @alertDismissed="clearError" :alertMsg="error.message"></AlertCmp>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSubmit">
                <v-layout row>
                  <v-flex>
                    <v-text-field
                      name="email"
                      label="Email"
                      id="email"
                      v-model="email"
                      type="email"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex>
                    <v-text-field
                      name="password"
                      label="Password"
                      id="password"
                      v-model="password"
                      type="password"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex>
                    <v-btn type="submit">Sign In</v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>

  export default {
    data () {
      return {
        email: '',
        password: '',
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      error(){
        return this.$store.getters.error
      }
    },
    watch: {
      user(value) {
        if(value !== null && value !== undefined)
          this.$router.push('/')
      }
    },
    methods: {
      onSubmit(){
        // Vuex
        const user = {email: this.email, password: this.password}
        this.$store.dispatch('signinUser', user)

      },
      clearError(){
        this.$store.dispatch('clearError')
      }
    }
  }
</script>
