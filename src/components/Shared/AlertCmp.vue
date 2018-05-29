<template>
  <v-alert value="true" type="error" dismissible @input="dismissAlert">
    {{alertMsg}}
  </v-alert>
</template>


<script>
  export default {
    props: ['alertMsg'],
    methods: {
      dismissAlert () {
        this.$emit('alertDismissed')
      }
    }
  }
</script>
