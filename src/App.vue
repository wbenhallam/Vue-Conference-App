<template>
  <v-app>
    <v-navigation-drawer
      temporary
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      v-model="sidenav"  app>
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{item.title}}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark app fixed
               :clipped-left="$vuetify.breakpoint.mdAndUp"
               class="primary darken-3">
      <v-toolbar-side-icon @click="sidenav = !sidenav"
      ></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">QRI BD Initiatives</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-icon left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>

      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      sidenav: false,
      menuItems: [
        {icon: 'work', title: 'View Conferences', link: '/conferences'},
        {icon: 'add_circle', title: 'Add Conference', link: '/conferences/add'},
        {icon: 'person', title: 'Profile', link: '/profile'},
        {icon: 'face', title: 'Sign up', link: '/signup'},
        {icon: 'lock_open', title: 'Sign in', link: '/signin'},
      ]
    }
  }
}
</script>
