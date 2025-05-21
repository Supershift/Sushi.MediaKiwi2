import { RouteComponent } from "vue-router";
import { modules as HotelsModules } from "./Hotels/modules";
import { modules as DemoModules } from "./Demo/modules";
import { modules as CustomerModules } from "./Customers/modules";
import { modules as CountryModules } from "./Country/modules";
import { modules as AccountModules } from "./Account/modules";

const modules: Record<string, RouteComponent> = {
  ...HotelsModules,
  ...DemoModules,
  ...CustomerModules,
  ...CountryModules,
  ...AccountModules,
};

export { modules };
