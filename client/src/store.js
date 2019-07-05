import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

Vue.use(Vuex);

import { defaultClient as apolloClient } from "./main.js";
import { GET_POSTS, SINGIN_USER, GET_CURRENT_USER } from "./queries.js";

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false,
    user: null,
    error: null,
    authError: null
  },
  mutations: {
    SET_POSTS(state, payload) {
      state.posts = payload;
    },
    SET_LOADING: (state, payload) => (state.loading = payload),
    SET_USER: (state, payload) => (state.user = payload),
    SET_ERROR: (state, payload) => (state.error = payload),
    SET_AUTH_ERROR: (state, payload) => (state.authError = payload)
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit("SET_LOADING", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit("SET_USER", data.getCurrentUser);
          commit("SET_LOADING", false);
        })
        .catch(err => {
          console.error(err);
          commit("SET_LOADING", false);
        });
    },
    getPosts({ commit }) {
      commit("SET_LOADING", true);
      apolloClient
        .query({
          query: GET_POSTS
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
    },
    signinUser: ({ commit }, { username, password }) => {
      commit("SET_ERROR", null);
      commit("SET_LOADING", true);
      // clear token before signin
      localStorage.setItem("token", "");
      apolloClient
        .mutate({
          mutation: SINGIN_USER,
          variables: {
            username,
            password
          }
        })
        .then(({ data }) => {
          localStorage.setItem("token", data.signinUser.token);
          commit("SET_LOADING", false);
          router.go();
        })
        .catch(err => {
          commit("SET_LOADING", false);
          commit("SET_ERROR", err);
          console.error(err);
        });
    },
    signoutUser: async ({ commit }) => {
      // clear user in state
      commit("SET_USER", null);

      // remove token in localstorage
      localStorage.setItem("token", "");

      // end session
      await apolloClient.resetStore();

      // redirect home
      router.push("/");
    }
  },
  getters: {
    posts: state => state.posts,
    isLoading: state => state.loading,
    user: state => state.user,
    error: state => state.error,
    authError: state => state.authError
  }
});
