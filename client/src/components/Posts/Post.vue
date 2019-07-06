<template>
  <v-container v-if="getPost" class="mt-3" flexbox center>
    <!-- Post Card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{ getPost.title }}</h1>
            <v-btn large icon v-if="user">
              <v-icon large color="grey">favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{ getPost.likes }} LIKES</h3>
            <v-spacer></v-spacer>
            <v-btn large icon>
              <v-icon color="info" @click="goToPrevPage" large>arrow_back</v-icon>
            </v-btn>
          </v-card-title>

          <v-tooltip right>
            <span>Click to enlarge image</span>
            <v-card-media
              @click="toggleImageDialog"
              slot="activator"
              :src="getPost.imageUrl"
              id="post__image"
            ></v-card-media>
          </v-tooltip>

          <!-- Post Image Dialog-->
          <v-dialog v-model="dialog">
            <v-card>
              <v-card-media :src="getPost.imageUrl" height="80vh"></v-card-media>
            </v-card>
          </v-dialog>

          <!-- Categories Chips -->
          <v-card-text>
            <span v-for="(category, i) in getPost.categories" :key="i">
              <v-chip class="mb-3" color="accent" text-color="white">{{ category }}</v-chip>
            </span>
            <h3>{{ getPost.description }}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { GET_POST } from "../../queries";
import { mapGetters } from "vuex";

export default {
  name: "Post",
  props: ["postId"],
  data() {
    return {
      dialog: false
    };
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  methods: {
    goToPrevPage() {
      this.$router.go(-1);
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    }
  },
  computed: {
    ...mapGetters(["user"])
  }
};
</script>

<style lang="scss" scoped>
#post__image {
  height: 400px !important;
}
</style>