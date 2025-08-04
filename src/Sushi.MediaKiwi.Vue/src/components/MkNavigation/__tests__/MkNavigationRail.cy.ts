import "reflect-metadata";
import MkNavigationRailComponent from "../MkNavigationRail.vue";
import { Section } from "@/models/navigation";

// Declare the props to be used in all tests
const props = {
  railItems: [
    {
      id: "Home",
      name: "Section One",
      icon: "$arrowleft",
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
