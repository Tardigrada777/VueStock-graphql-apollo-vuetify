import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "babel-polyfill";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

import FormAlert from "./components/Shared/FormAlert";

// Register global component
Vue.component("form-alert", FormAlert);

Vue.use(VueApollo);

Vue.config.productionTip = false;

// Setup ApolloClient
export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  // include auth token with requests made to backend
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("[networkError]", networkError);
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);

        if (err.name === "AuthenticationError") {
          // set auth error in state
          store.commit("SET_AUTH_ERROR", err);
          // signout user to clear token
          store.dispatch("signoutUser");
        }
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });

new Vue({
  provide: apolloProvider.provide(),
  router,
  store,
  created() {
    // execute getCurrentUser Query
    this.$store.dispatch("getCurrentUser");
  },
  render: h => h(App)
}).$mount("#app");
