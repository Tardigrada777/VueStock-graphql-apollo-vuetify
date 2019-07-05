<template>
  <v-container text-xs-center>
    <!-- Signin Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card class="mt-5" color="white">
          <v-container>
            <!-- Signin Title -->
            <v-layout row wrap>
              <v-flex xs12 sm6 offset-sm3>
                <h1 class="title">Wellcome Back</h1>
              </v-flex>
            </v-layout>

            <v-form @submit.prevent="handleSigninUser" class="py-4 px-4">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field v-model="username" prepend-icon="face" type="text" label="Username"></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    v-model="password"
                    prepend-icon="extension"
                    type="password"
                    label="Password"
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn color="success" type="submit">Signin</v-btn>
                  <h3 class="title">
                    Don't have an account?
                    <router-link to="/signup">Signup</router-link>
                  </h3>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Signin",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  watch: {
    user(value) {
      // if user value changes redirect to home page
      if (value) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    ...mapActions(["signinUser"]),
    handleSigninUser() {
      this.signinUser({
        username: this.username,
        password: this.password
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>