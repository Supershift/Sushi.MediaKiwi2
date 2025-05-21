import { RouteComponent } from "vue-router";
import EditAccount from "./EditAccount.vue";
import ErrorSamples from "./ErrorSamples.vue";
import GetAccount from "./GetAccount.vue";

const modules: Record<string, RouteComponent> = {
  EditAccount,
  ErrorSamples,
  GetAccount,
};

export { modules };
