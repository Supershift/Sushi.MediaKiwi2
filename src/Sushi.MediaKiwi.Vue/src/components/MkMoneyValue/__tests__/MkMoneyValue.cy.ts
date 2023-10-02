import "reflect-metadata";
import MkMoneyValue from "./../MkMoneyValue.vue";

describe("<MkMoneyValue />", () => {
  it("renders", () => {
    cy.mount(MkMoneyValue, {
      props: {
        label: "SRP",
        modelValue: {
          currency: "EUR",
          amount: 12.5,
        },
      },
    });
  });
});
