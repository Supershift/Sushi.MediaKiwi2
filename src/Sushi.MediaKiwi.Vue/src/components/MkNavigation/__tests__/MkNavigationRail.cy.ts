import "reflect-metadata";
import MkNavigationRailComponent from "../MkNavigationRail.vue";
import { Section } from "@/models";

// Declare the props to be used in all tests
const props = {
  railItems: [
    {
      id: 1,
      name: "Section One",
      sortOrder: 0,
      icon: "$arrowLeft",
    },
  ] as Array<Section>,
};

describe("MkNavigation", () => {
  it("Should be rendered", async () => {
    // TODO: Fix this test - we are missing the layout component or the ResizeObserver when trying to mount (https://github.com/jsdom/jsdom/issues/3368)
    cy.mount(MkNavigationRailComponent, { props });

    // Check that the component is rendered and contains an icon
    cy.get(".v-list").should("exist");
  });
});
