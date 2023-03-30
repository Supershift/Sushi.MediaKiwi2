import { RouteComponent } from "vue-router";
import ViewOverview from "./view/ViewOverview.vue";
import ViewEdit from "./view/ViewEdit.vue";

const modules: Record<string, RouteComponent> = {
  MkViewOverview: ViewOverview,
  MkViewEdit: ViewEdit,
};

export { modules };
