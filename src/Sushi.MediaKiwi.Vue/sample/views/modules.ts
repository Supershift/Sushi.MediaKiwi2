import { RouteComponent } from "vue-router";
import Countries from "./Countries.vue";
import CountriesEmpty from "./CountriesEmpty.vue";
import CountryDetails from "./CountryDetails.vue";
import CountryEdit from "./CountryEdit.vue";
import Customers from "./Customers.vue";
import CustomersTableMap from "./Customers_tableMap.vue";
import Home from "./Home.vue";
import LoggedIn from "./LoggedIn.vue";
import SampleDataEdit from "./SampleDataEdit.vue";
import SampleDeepDataEdit from "./SampleDeepDataEdit.vue";
import Screen1 from "./Screen1.vue";

import { modules as HotelsModules } from "./Hotels/modules";
import { modules as DemoModules } from "./Demo/modules";

const modules: Record<string, RouteComponent> = {
  Countries,
  CountriesEmpty,
  CountryDetails,
  CountryEdit,
  Customers,
  CustomersTableMap,
  Home,
  LoggedIn,
  SampleDataEdit,
  SampleDeepDataEdit,
  Screen1,
  ...HotelsModules,
  ...DemoModules,
};

export { modules };
