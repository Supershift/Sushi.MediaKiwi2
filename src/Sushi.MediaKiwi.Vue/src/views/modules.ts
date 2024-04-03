import { RouteComponent } from "vue-router";
import ViewOverview from "./ViewOverview.vue";
import ViewEdit from "./ViewEdit.vue";
import SectionOverview from "./SectionOverview.vue";
import SectionEdit from "./SectionEdit.vue";
import LocaleOverview from "./LocaleOverview.vue";
import LocaleEdit from "./LocaleEdit.vue";
import StyleGuideView from "./StyleGuideView.vue";
import NavigationItemOverview from "./NavigationItemOverview.vue";
import NavigationItemEdit from "./NavigationItemEdit.vue";

const modules: Record<string, RouteComponent> = {
  MkViewOverview: ViewOverview,
  MkViewEdit: ViewEdit,
  MkSectionOverview: SectionOverview,
  MkSectionEdit: SectionEdit,
  MkLocaleOverview: LocaleOverview,
  MkLocaleEdit: LocaleEdit,
  MkStyleGuideView: StyleGuideView,
  MkNavigationItemOverview: NavigationItemOverview,
  MkNavigationItemEdit: NavigationItemEdit,
};

export { modules };
