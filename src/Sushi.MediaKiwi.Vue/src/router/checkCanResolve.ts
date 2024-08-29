import { RouteLocationNormalized, Router } from "vue-router";

export function addCheckCanResolve(router: Router): void {
  router.beforeResolve(async (to: RouteLocationNormalized) => {
    // check if the component can be resolved
    if (to.matched.length == 0) {
      // const message = await getRouterErrorMessage(1); // 1 is the ErrorTypes enum value for ErrorTypes.MATCHER_NOT_FOUND
      // const snackbar = useSnackbarStore();
      // snackbar.showMessage(message);
      // return false;
    }
  });
}
