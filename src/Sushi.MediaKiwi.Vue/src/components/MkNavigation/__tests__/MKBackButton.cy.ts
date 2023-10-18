/* eslint-disable no-unused-labels */
import "reflect-metadata";
import MKBackButtonComponent from "../MkBackButton.vue";
import { getDefaultRouterOptions } from "@/router/getDefaultRouterOptions";
import { createRouter } from "vue-router";

describe("<MkBackButton />", () => {
  it("Should be rendered", () => {
    // Mount and pass our router instance
    cy.mount(MKBackButtonComponent);
  });

  it("Should navigate", () => {
    // Create custom router
    const routerOptions = getDefaultRouterOptions();
    const router = createRouter(routerOptions);

    // Stub the router methods
    router.back = cy.stub().as("back");

    // Mount and pass our router instance
    cy.mount(MKBackButtonComponent, { router });

    // Simulate a click on the button
    cy.get("button").click();

    // get the back spy and check it was called
    cy.get("@back").should("have.been.called");
  });
});
