<template>
  <v-alert type="error" :value="true" transition="scale-transition" dismissible>
    <span>{{message}}</span>
  </v-alert>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
</style>