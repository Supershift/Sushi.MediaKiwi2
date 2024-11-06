import { RouteComponent } from "vue-router";
import Countries from "./Countries.vue";
import CountriesEmpty from "./CountriesEmpty.vue";
import CountryEdit from "./AddCountry.vue";
import Customers from "./Customers.vue";
import CustomersTableMap from "./Customers_tableMap.vue";
import Home from "./Home.vue";
import LoggedIn from "./LoggedIn.vue";
import SampleDataEdit from "./SampleDataEdit.vue";
import SampleDeepDataEdit from "./SampleDeepDataEdit.vue";
import Screen1 from "./Screen1.vue";

import { modules as HotelsModules } from "./Hotels/modules";
import { modules as DemoModules } from "./Demo/modules";

// import custom layouts
import * as MyCustomLayouts from "../layouts/index";

const modules: Record<string, RouteComponent> = {
  Countries,
  CountriesEmpty,
  CountryEdit,
  Customers,
  CustomersTableMap,
  Home,
  LoggedIn,
  SampleDataEdit,
  SampleDeepDataEdit,
  Screen1,
  ...MyCustomLayouts,
  ...HotelsModules,
  ...DemoModules,
};

export { modules };
