import store from "../store";

export function AuthGuard(to, from, next) {
  if (!store.getters.user) {
    next({
      path: "/signin"
    });
  } else {
    next();
  }
}
