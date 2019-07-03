import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";

import colors from "vuetify/es5/util/colors";

Vue.use(Vuetify, {
  iconfont: "md",
  theme: {
    primary: colors.indigo.base,
    secondary: colors.lightBlue,
    accent: colors.pink.base,
    error: colors.red.base,
    warning: colors.amber.base,
    info: colors.purple.base,
    success: colors.lightGreen
  }
});
