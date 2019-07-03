import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { gql } from "apollo-boost";
import { defaultClient as apolloClient } from "./main.js";

export default new Vuex.Store({
  state: {
    posts: []
  },
  mutations: {
    SET_POSTS(state, payload) {
      state.posts = payload;
    }
  },
  actions: {
    getPosts({ commit }) {
      apolloClient
        .query({
          query: gql`
            query {
              getPosts {
                _id
                title
                imageUrl
              }
            }
          `
        })
        .then(({ data }) => {
          console.log(data);
          commit("SET_POSTS", data.getPosts);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  getters: {
    posts: state => state.posts
  }
});
