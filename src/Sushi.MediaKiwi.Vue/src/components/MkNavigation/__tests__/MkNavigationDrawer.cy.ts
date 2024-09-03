/* eslint-disable no-unused-labels */
import "reflect-metadata";
import MkNavigationDrawer from "../MkNavigationDrawer.vue";
import { NavigationItem, Section } from "@/models/navigation";

// Declare the props to be used in all tests
const props = {
  listItems: [
    {
      id: "444",
      name: "Test Item",
      section: { id: "Home" } as Section,
      componentKey: "home.vue",
      children: []
    },
  ] as Array<NavigationItem>,
};

describe("<MkNavigationDrawer />", () => {
  it.skip("Should be rendered", () => {
    // TODO: Mock the i18next

    // Mount the component in a suspense wrapper
    cy.mount(MkNavigationDrawer, { props });

    cy.get(".v-navigation-drawer").should("exist");
  });
});
