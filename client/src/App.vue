<template>
  <v-app>
    <!-- Horizontal navbar -->
    <v-toolbar fixed dark color="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>

      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer;">VueStock</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <!-- Search input -->
      <v-text-field flex prepend-icon="search" placeholder="Search posts" color="white"></v-text-field>

      <v-spacer></v-spacer>
      <!-- Horizontal Navbar Links -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="(item, i) in navItems" :to="item.link" :key="i">
          <v-icon class="hidden-sm-only" left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!-- App content -->
    <v-content>
      <v-container class="mt-4">
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  computed: {
    navItems() {
      return [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
