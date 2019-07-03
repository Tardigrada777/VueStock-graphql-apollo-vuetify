import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { gql } from "apollo-boost";
import { defaultClient as apolloClient } from "./main.js";

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false
  },
  mutations: {
    SET_POSTS(state, payload) {
      state.posts = payload;
    },
    SET_LOADING: (state, payload) => (state.loading = payload)
  },
  actions: {
    getPosts({ commit }) {
      commit("SET_LOADING", true);
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
          commit("SET_LOADING", false);
        })
        .catch(err => {
          console.log(err);
          commit("SET_LOADING", false);
        });
    }
  },
  getters: {
    posts: state => state.posts,
    isLoading: state => state.loading
  }
});
