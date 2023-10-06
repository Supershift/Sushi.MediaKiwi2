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
      cy.get("[data-cy='mk-money-value']").should("contain", "SRP");
    });

    it("Should have EUR currency", () => {
      // Mount the component
      cy.mount(MkMoneyValue, { props });

      // Get the element that should hold the currency value
      // Check that the element is rendered and contains the currency
      cy.get("[data-cy='currency-autocomplete']").should("contain", "EUR");
    });

    it("Should have disabled currecy input when gaining one currency", () => {
      // Mount the component
      cy.mount(MkMoneyValue, { props: { currencies: ["EUR"] } });

      // Get the input element and cast it to HTMLInputElement to access the value
      cy.get("[data-cy='currency-autocomplete']").should("have.class", "v-input--disabled");
    });

    it("Should have 12,5 as value", () => {
      // Mount the component
      cy.mount(MkMoneyValue, { props }).then(({ wrapper }) => {
        const input = wrapper.find("[data-cy='value-input'] input");
        expect(input.element).to.have.value("12.5");
      });
    });
  });

  describe("Input manipulation", () => {
    describe("Using Vue Test Utils Wrapper", () => {
      it("Should update the value when input is changed", () => {
        // Mount the component
        cy.mount(MkMoneyValue, { props }).then(({ wrapper }) => {
          const input = wrapper.find("[data-cy='value-input'] input");
          input.setValue("15.5");
          expect(input.element).to.have.value("15.5");
        });
      });

      it("Should update the currency when input is changed", () => {
        cy.mount(MkMoneyValue, { props }).then(({ wrapper }) => {
          const input = wrapper.find("[data-cy='currency-autocomplete'] input");

          input.setValue("AED");

          expect(input.element).to.have.value("AED");
        });
      });
    });

    describe("Using Cypress", () => {
      it("Should select currency and enter value", () => {
        cy.mount(MkMoneyValue, { props });
        // Find and interact with the currency autocomplete component.
        cy.get("[data-cy=currency-autocomplete]").click(); // Click to open the dropdown

        // Wait for the dropdown to appear
        cy.get(".v-list-item-title").should("be.visible");

        // Select a currency (AED in this example)
        cy.contains(".v-list-item-title", "AED").click();

        // Find and interact with the value text field.
        cy.get("[data-cy=value-input]").clear().type("1000"); // Enter a value (e.g., 1000)

        // Assert that the selected currency and value are displayed correctly.
        cy.get("[data-cy=currency-autocomplete]").should("contain", "AED");
        cy.get("[data-cy=value-input] input").should("have.value", "1000");
      });
    });
  });
});
