import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

Vue.use(Vuex);

import { defaultClient as apolloClient } from "./main.js";
import {
  GET_POSTS,
  SINGIN_USER,
  GET_CURRENT_USER,
  SIGNUP_USER,
  ADD_POST,
  SEARCH_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST
} from "./queries.js";

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false,
    user: null,
    userPosts: [],
    error: null,
    authError: null,
    searchResults: []
  },
  mutations: {
    SET_POSTS(state, payload) {
      state.posts = payload;
    },
    SET_LOADING: (state, payload) => (state.loading = payload),
    SET_USER: (state, payload) => (state.user = payload),
    SET_USER_POSTS: (state, payload) => (state.userPosts = payload),
    SET_ERROR: (state, payload) => (state.error = payload),
    SET_AUTH_ERROR: (state, payload) => (state.authError = payload),
    SET_SEARCH_RESULTS: (state, payload) => {
      if (payload !== null) state.searchResults = payload;
    },
    CLEAR_SEARCH_RESULTS: state => {
      state.searchResults = [];
    }
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
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: {
            userId: payload
          }
        })
        .then(({ data }) => {
          commit("SET_USER_POSTS", data.getUserPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    addPost: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // First read the query you want to update
            const data = cache.readQuery({
              query: GET_POSTS
            });

            // create updated data
            data.getPosts.unshift(addPost);
            // write updated data back to query
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          optimisticResponse: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1,
              ...payload
            }
          }
        })
        .then(({ data }) => {
          console.log(data);
        })
        .catch(err => {
          console.error(err);
        });
    },
    deleteUserPost: ({ commit, state }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.deleteUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];

          commit("SET_USER_POSTS", userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateUserPost: ({ commit, state }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.updateUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];

          commit("SET_USER_POSTS", userPosts);
        })
        .catch(err => {
          console.error(err);
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
    },
    signupUser: ({ commit }, { username, email, password }) => {
      commit("SET_ERROR", null);
      commit("SET_LOADING", true);
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: {
            username,
            email,
            password
          }
        })
        .then(({ data }) => {
          localStorage.setItem("token", data.signupUser.token);
          commit("SET_LOADING", false);
          router.go();
        })
        .catch(err => {
          commit("SET_LOADING", false);
          commit("SET_ERROR", err);
          console.error(err);
        });
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("SET_SEARCH_RESULTS", data.searchPosts);
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  getters: {
    posts: state => state.posts,
    isLoading: state => state.loading,
    user: state => state.user,
    userPosts: state => state.userPosts,
    error: state => state.error,
    authError: state => state.authError,
    userFavorites: state => state.user && state.user.favorites,
    searchResults: state => state.searchResults
  }
});
