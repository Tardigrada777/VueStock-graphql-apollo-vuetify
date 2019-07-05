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

        <!-- Signout Button -->
        <v-list-tile @click="handleSignoutUser" v-if="user">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Signout</v-list-tile-content>
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

        <!-- Profile Button -->
        <v-btn v-if="user" flat to="/profile">
          <v-icon class="hidden-sm-only" left>account_box</v-icon>
          <v-badge color="accent">
            <template v-slot:badge>
              <span>5</span>
            </template>
            <span>Profile</span>
          </v-badge>
        </v-btn>

        <!-- Signout Button -->
        <v-btn @click="handleSignoutUser" flat v-if="user">
          <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>Signout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!-- App content -->
    <v-content>
      <v-container class="mt-4">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>

        <!-- Auth snackbar -->
        <v-snackbar :timeout="5000" color="success" bottom left v-model="authSnackbar">
          <v-icon class="mr-3">check_circle</v-icon>
          <h5>You are signed in!</h5>
          <v-btn dark flat @click="authSnackbar = false">Close</v-btn>
        </v-snackbar>

        <!-- Auth Error snackbar -->
        <v-snackbar
          v-if="authError"
          :timeout="5000"
          color="info"
          bottom
          left
          v-model="authErrorSnackbar"
        >
          <v-icon class="mr-3">cancel</v-icon>
          <h5>{{ authError.message }}</h5>
          <v-btn dark flat to="/signin" @click="authErrorSnackbar = false">signin</v-btn>
        </v-snackbar>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  data() {
    return {
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false
    };
  },
  computed: {
    ...mapGetters(["authError", "user"]),
    navItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];

      if (this.user) {
        items = [{ icon: "chat", title: "Posts", link: "/posts" }];
      }

      return items;
    },
    sideNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];

      if (this.user) {
        items = [
          { icon: "chat", title: "Posts", link: "/posts" },
          { icon: "stars", title: "Create Post", link: "/post/add" },
          { icon: "account_box", title: "Profile", link: "/profile" }
        ];
      }
      return items;
    }
  },
  watch: {
    user(newValue, oldValue) {
      // if we had no value for user before, show snackbar
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      // if auth error is not null, show auth error snackbar
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    }
  },
  methods: {
    ...mapActions(["signoutUser"]),
    toggleSideBar() {
      this.sideNav = !this.sideNav;
    },
    handleSignoutUser() {
      this.signoutUser();
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
