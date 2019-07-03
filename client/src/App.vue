<template>
  <v-app>
    <!-- Side Navbar -->
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="secondary" dark flat>
        <v-toolbar-side-icon @click="toggleSideBar"></v-toolbar-side-icon>
        <v-toolbar-title class="pl-3">VueStock</v-toolbar-title>
      </v-toolbar>

      <!-- Side Navbar Links -->
      <v-list class="mt-2">
        <v-list-tile
          ripple
          v-for="(item, i) in sideNavItems"
          :key="i"
          :to="item.link"
          class="sideNavTile"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- Horizontal navbar -->
    <v-toolbar fixed dark color="primary">
      <v-toolbar-side-icon @click="toggleSideBar"></v-toolbar-side-icon>

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
    return {
      sideNav: false
    };
  },
  computed: {
    navItems() {
      return [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
    },
    sideNavItems() {
      return [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
    }
  },
  methods: {
    toggleSideBar() {
      this.sideNav = !this.sideNav;
    }
  }
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
}

.sideNavTile {
  a {
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }
  }
}
</style>
