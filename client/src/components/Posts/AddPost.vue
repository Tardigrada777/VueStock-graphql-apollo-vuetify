<template>
  <v-container text-xs-center>
    <!-- Add Post Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <!-- Add Post Title -->
        <v-layout row wrap>
          <v-flex xs12 sm6 offset-sm3>
            <h1 class="primary--text">Add Post</h1>
          </v-flex>
        </v-layout>

        <v-form
          v-model="isFormValid"
          lazy-validation
          ref="form"
          @submit.prevent="handleAddPost"
          class="py-4 px-4"
        >
          <!-- Title -->
          <v-layout row>
            <v-flex xs12>
              <v-text-field :rules="titleRules" v-model="title" type="text" label="Post Title"></v-text-field>
            </v-flex>
          </v-layout>

          <!-- Image Url -->
          <v-layout row>
            <v-flex xs12>
              <v-text-field :rules="imageRules" v-model="imageUrl" type="text" label="Image URL"></v-text-field>
            </v-flex>
          </v-layout>

          <!-- Image Preview -->
          <v-layout row>
            <v-flex xs12>
              <img :src="imageUrl" height="300" />
            </v-flex>
          </v-layout>

          <!-- Categories Select -->
          <v-layout row>
            <v-flex xs12>
              <v-select
                v-model="categories"
                :items="['Art', 'Education', 'Travel', 'Food']"
                multiple
                :rules="categoriesRules"
                label="Categories"
              ></v-select>
            </v-flex>
          </v-layout>

          <!-- Description Text Area -->
          <v-layout row>
            <v-flex xs12>
              <v-textarea type="text" :rules="descRules" v-model="description" label="Description"></v-textarea>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn
                :disabled="!isFormValid || isLoading"
                :loading="isLoading"
                color="primary"
                type="submit"
              >
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </template>
                Add
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "Title is required",
        title => title.length < 20 || "Title must have less then 20 characters"
      ],
      imageRules: [image => !!image || "Image is required"],
      categoriesRules: [
        categories =>
          categories.length >= 1 || "At least one category is required"
      ],
      descRules: [
        desc => !!desc || "Description is required",
        desc => desc.length < 200 || "Title must have less then 200 characters"
      ]
    };
  },
  computed: {
    ...mapGetters(["isLoading", "user"])
  },
  methods: {
    ...mapActions(["addPost"]),
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.addPost({
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id
        });

        this.$router.push("/");
      }
      // add post action
    }
  }
};
</script>

<style lang="scss" scoped>
</style>