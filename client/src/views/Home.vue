<template>
  <v-container text-xs-center>
    <v-flex xs12>
      <v-carousel v-if="posts.length > 0" v-bind="{ 'cycle': true }" interval="3000">
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
    ...mapGetters(["posts"])
  },
  methods: {
    ...mapActions(["getPosts"]),
    handleGetCarouselPosts() {
      // reach
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
