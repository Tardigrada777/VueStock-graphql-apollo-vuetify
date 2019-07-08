<template>
  <v-container class="text-xs-center">
    <!-- User details card -->
    <v-flex sm6 offset-sm3>
      <v-card color="white">
        <v-layout>
          <v-flex xs5>
            <v-card-media height="125px" contain :src="user.avatar"></v-card-media>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{ user.username }}</div>
                <div>Joined {{ user.joinDate }}</div>
                <div
                  class="hidden-xs-only font-weight-regular"
                >{{ user.favorites.length }} favorites</div>
                <div class="hidden-xs-only font-weight-regular">2 Posts added</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- Posts Favorites by User -->
    <v-layout class="mt-4" row wrap v-if="!userFavorites.length">
      <v-flex xs12>
        <h2 class="title">You have no favorites currently. Go and add some!</h2>
      </v-flex>
    </v-layout>
    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">
          Favorited
          <span class="font-weight-regular">{{ userFavorites.length }}</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-2 mr2" hover>
            <v-card-media height="30vh" :src="favorite.imageUrl"></v-card-media>
            <v-card-text>{{ favorite.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  computed: {
    ...mapGetters(["user", "userFavorites"])
  }
};
</script>

<style lang="scss" scoped>
</style>