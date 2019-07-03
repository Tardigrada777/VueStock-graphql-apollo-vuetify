<template>
  <v-container text-xs-center>
    <v-layout row>
      <v-dialog v-model="isLoading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="primary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <v-flex xs12>
      <v-carousel v-if="!isLoading && posts.length > 0" v-bind="{ 'cycle': true }" interval="3000">
        <v-carousel-item v-for="post in posts" :key="post.title" :src="post.imageUrl">
          <h1 id="carousel__title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { gql } from "apollo-boost";

export default {
  name: "Home",
  computed: {
    ...mapGetters(["posts", "isLoading"])
  },
  methods: {
    ...mapActions(["getPosts"]),
    handleGetCarouselPosts() {
      this.getPosts();
    }
  },
  created() {
    this.handleGetCarouselPosts();
  }
};
</script>

<style lang="scss" scoped>
#carousel__title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 5px 5px 0 0;
  padding: 0.5em;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;

  font-size: 22px;
}
</style>
