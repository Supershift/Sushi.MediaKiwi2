import { RouteComponent } from "vue-router";
import Customers_tableMap from "./Customers_tableMap.vue";
import Customers from "./Customers.vue";

const modules: Record<string, RouteComponent> = {
  Customers_tableMap,
  Customers,
};

export { modules };
