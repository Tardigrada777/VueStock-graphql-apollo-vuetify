<template>
  <v-container>
    <h1>Home</h1>
    <ApolloQuery :query="getPostsQuery">
      <template slot-scope="{ result: { error, data, networkStatus}, isLoading }">
        <div v-if="isLoading">Loading...</div>
        <div v-else-if="error">Error! {{ error.message }}</div>
        <ul v-else>
          <li
            v-for="post in data.getPosts"
            :key="post.title"
          >{{post.title}} -- {{ post.description }}</li>
        </ul>
      </template>
    </ApolloQuery>
  </v-container>
</template>

<script>
import { gql } from "apollo-boost";

export default {
  name: "Home",
  data() {
    return {
      posts: [],
      getPostsQuery: gql`
        query {
          getPosts {
            _id
            title
            imageUrl
            categories
            description
            likes
          }
        }
      `
    };
  }
};
</script>
