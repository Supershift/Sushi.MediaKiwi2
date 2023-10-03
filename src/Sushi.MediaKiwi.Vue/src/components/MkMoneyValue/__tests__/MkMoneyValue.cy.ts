import "reflect-metadata";
import MkMoneyValue from "./../MkMoneyValue.vue";

// Declare the props to be used in all tests
const props = {
  label: "SRP",
  modelValue: {
    currency: "EUR",
    amount: 12.5,
  },
};

describe("<MkMoneyValue />", () => {
  it("Should be rendered", () => {
    cy.mount(MkMoneyValue, { props });
  });

  describe("Prop validation", () => {
    it("Should have label SPR", () => {
      // Mount the component
      cy.mount(MkMoneyValue, { props });

      // Check that the label is rendered
      cy.get(".v-input__control").should("contain", "SRP");
    });

    it("Should have EUR currency", () => {
      // Mount the component
      cy.mount(MkMoneyValue, { props });

      // Get the element that should hold the currency value
      const element = cy.get(".v-autocomplete__selection .v-autocomplete__selection-text");

      // Check that the element is rendered and contains the currency
      element.should("contain", "EUR");
    });

    it("Should have 12.5 as value", () => {
      // Mount the component
      cy.mount(MkMoneyValue, { props });

      // Get the input element and cast it to HTMLInputElement to access the value
      const element = cy.get(".v-field__field input[type='number']");

      // Check that the element is rendered and contains the currency
      element.should("exist");
      element.should("have.value", "12.5");
    });
  });
});
