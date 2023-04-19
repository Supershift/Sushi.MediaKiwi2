import { RouteComponent } from "vue-router";
import ViewOverview from "./view/ViewOverview.vue";
import ViewEdit from "./view/ViewEdit.vue";
import SectionOverview from "./section/SectionOverview.vue";
import SectionEdit from "./section/SectionEdit.vue";

const modules: Record<string, RouteComponent> = {
  MkViewOverview: ViewOverview,
  MkViewEdit: ViewEdit,
  MkSectionOverview: SectionOverview,
  MkSectionEdit: SectionEdit,
};

export { modules };
