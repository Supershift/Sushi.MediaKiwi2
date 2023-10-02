import "reflect-metadata";
import MkMoneyValue from "./../MkMoneyValue.vue";

describe("<MkMoneyValue />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(MkMoneyValue);
  });
});
