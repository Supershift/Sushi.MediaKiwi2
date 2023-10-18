import "reflect-metadata";
import MkNavigationComponent from "../MkNavigation.vue";

describe("<MkNavigation />", () => {
  // TODO: Mock the routemanager and test the component

  it.skip("Should be rendered", () => {
    // Mount the component in a suspense wrapper
    cy.mount(MkNavigationComponent);

    // Check that the component is rendered and contains an icon
    cy.get("v-list").should("exist");
  });
});
