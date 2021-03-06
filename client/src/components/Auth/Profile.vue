<template>
  <v-container class="text-xs-center">
    <!-- User details card -->
    <v-flex sm6 offset-sm3>
      <v-card color="white">
        <v-layout>
          <v-flex xs5>
            <v-img height="125px" contain :src="user.avatar"></v-img>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{ user.username }}</div>
                <div>Joined {{ formatJoinDate(user.joinDate) }}</div>
                <div
                  class="hidden-xs-only font-weight-regular"
                >{{ user.favorites.length }} favorites</div>
                <div class="hidden-xs-only font-weight-regular">{{ userPosts.length }} Posts added</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- Posts Favorites by User -->
    <v-layout class="mt-4" row wrap v-if="!userFavorites.length">
      <v-flex xs12>
        <h2 class="title">You have no favorites currently. Go and add some!</h2>
      </v-flex>
    </v-layout>
    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">
          Favorited
          <span class="font-weight-regular">({{ userFavorites.length }})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-2 mr2" hover>
            <v-img @click="goToPost(favorite._id)" height="30vh" :src="favorite.imageUrl"></v-img>
            <v-card-text>{{ favorite.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Post Created By User -->
    <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2 class="title">You have no posts currently. Go and add some!</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">
          Your Posts
          <span class="font-weight-regular">({{ userPosts.length }})</span>
        </h2>
      </v-flex>

      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-2 mr-2" hover>
            <v-btn @click="loadPost(post)" color="info" floating fab small dark>
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn @click="handleDeleteUserPost(post)" color="error" floating fab small dark>
              <v-icon>delete</v-icon>
            </v-btn>

            <v-img @click="goToPost(post._id)" :src="post.imageUrl" height="30vh"></v-img>
            <v-card-text>{{ post.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Edit Post Dialog -->
    <v-dialog persistent xs12 sm6 offset-sm-3 v-model="editPostDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2">Update Post</v-card-title>

        <v-container>
          <v-form
            v-model="isFormValid"
            lazy-validation
            ref="form"
            @submit.prevent="handleUpdateUserPost"
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
                <v-textarea
                  type="text"
                  :rules="descRules"
                  v-model="description"
                  label="Description"
                ></v-textarea>
              </v-flex>
            </v-layout>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :disabled="!isFormValid" type="submit" class="success--text" flat>update</v-btn>
              <v-btn class="error--text" flat @click="editPostDialog = false">cancel</v-btn>
            </v-card-actions>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      editPostDialog: false,

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
    ...mapGetters(["user", "userFavorites", "userPosts"])
  },
  methods: {
    ...mapActions(["getUserPosts", "updateUserPost", "deleteUserPost"]),
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },
    formatJoinDate(date) {
      return moment(new Date(date)).format("ll");
    },
    handleGetUserPosts() {
      this.getUserPosts(this.user._id);
    },
    handleUpdateUserPost() {
      // update user post
      if (this.$refs.form.validate()) {
        this.updateUserPost({
          postId: this.postId,
          userId: this.user._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description
        });
        this.editPostDialog = false;
      }
    },
    handleDeleteUserPost(post) {
      this.loadPost(post, false);
      const deletePost = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (deletePost) {
        this.deleteUserPost({
          postId: this.postId
        });
      }
    },
    loadPost(
      { _id, title, imageUrl, categories, description },
      editPostDialog = true
    ) {
      this.editPostDialog = editPostDialog;
      this.postId = _id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.categories = categories;
      this.description = description;
    }
  },
  created() {
    this.handleGetUserPosts();
  }
};
</script>

<style lang="scss" scoped>
</style>