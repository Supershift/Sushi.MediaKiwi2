import MkDatePresetMenu from "../MkDatePresetMenu.vue";

describe("<MkDatePresetMenu />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(MkDatePresetMenu);
  });
});
