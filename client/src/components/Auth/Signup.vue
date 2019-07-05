<template>
  <v-container text-xs-center>
    <!-- Error Alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <!-- Signup Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card class="mt-5" color="white">
          <v-container>
            <!-- Signup Title -->
            <v-layout row wrap>
              <v-flex xs12 sm6 offset-sm3>
                <h1 class="title">Get Started Here</h1>
              </v-flex>
            </v-layout>

            <v-form
              v-model="isFormValid"
              lazy-validation
              ref="form"
              @submit.prevent="handleSignupUser"
              class="py-4 px-4"
            >
              <!-- Username -->
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="usernameRules"
                    v-model="username"
                    prepend-icon="face"
                    type="text"
                    label="Username"
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <!-- Email -->
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="emailRules"
                    v-model="email"
                    prepend-icon="face"
                    type="email"
                    label="Email"
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <!-- Password -->
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    prepend-icon="extension"
                    type="password"
                    label="Password"
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <!-- Repeat Password -->
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    v-model="passwordConfirmation"
                    :rules="passwordRules"
                    prepend-icon="gavel"
                    type="password"
                    label="Confirm Password"
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn
                    :disabled="!isFormValid || isLoading"
                    :loading="isLoading"
                    color="info"
                    type="submit"
                  >
                    <template v-slot:loader>
                      <span class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </template>
                    Signup
                  </v-btn>
                  <h3 class="title">
                    Already have an account?
                    <router-link to="/signin">Signin</router-link>
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
import { mapGetters } from "vuex";

export default {
  name: "Signup",
  data() {
    return {
      isFormValid: true,
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      usernameRules: [
        username => !!username || "Username is required",
        username =>
          username.length < 10 || "Username cannot be more then 10 characters"
      ],
      emailRules: [
        email => !!email || "Email is required",
        email => /.@+./.test(email) || "Email must be valid"
      ],
      passwordRules: [
        password => !!password || "Password is required",
        password =>
          password.length >= 4 || "Password must be at least 4 characters",
        confirmation =>
          confirmation === this.password || "Password must be match"
      ]
    };
  },
  computed: {
    ...mapGetters(["isLoading", "error", "user"])
  },
  watch: {
    user(value) {
      if (value) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    handleSignupUser() {
      // signup user action
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signupUser", {
          username: this.username,
          email: this.email,
          password: this.password
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>