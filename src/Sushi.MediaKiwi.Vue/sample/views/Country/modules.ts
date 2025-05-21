import { RouteComponent } from "vue-router";
import AddCountry from "./AddCountry.vue";
import Countries from "./Countries.vue";
import CountriesEmpty from "./CountriesEmpty.vue";
import CountriesEmptyCustomActions from "./CountriesEmptyCustomActions.vue";
import CountryEdit from "./CountryEdit.vue";

const modules: Record<string, RouteComponent> = {
  AddCountry,
  Countries,
  CountriesEmpty,
  CountriesEmptyCustomActions,
  CountryEdit,
};

export { modules };
