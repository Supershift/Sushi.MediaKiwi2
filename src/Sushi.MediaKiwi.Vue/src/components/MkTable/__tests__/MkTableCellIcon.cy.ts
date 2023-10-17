import "reflect-metadata";
import TableCellIconComponent from "./../MkTableCellIcon.vue";
import { IconsLibrary, TableIconPosition } from "@/models";
import { VueWrapper } from "@vue/test-utils";

describe("<MkTableCellIcon />", () => {
  describe("Icon", () => {
    const testData = {
      iconName: IconsLibrary.checkCircleOutline,
      color: "success",
    };

    it("Should render", () => {
      // Mount the component in a suspense wrapper
      cy.mount(TableCellIconComponent, { props: { data: testData } });

      // Assert that the icon and tooltip are displayed based on test data
      cy.get("[data-cy=icon]").should("have.class", `text-${testData.color}`);
      cy.get("[data-cy=icon] svg path")
        .invoke("attr", "d")
        .then((d) => {
          expect(d).to.equal(
            "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"
          );
        });
    });
  });

  describe("Icon with label", () => {
    const testData = {
      label: "Label Text",
      iconName: IconsLibrary.checkCircleOutline,
      color: "success",
    };

    it("Should display the icon with label in front", () => {
      // Mount the component in a suspense wrapper
      cy.mount(TableCellIconComponent, { props: { data: { ...testData, position: TableIconPosition.Prepend } } });

      cy.get("[data-cy=tooltip]").should("not.exist");

      // Assert that the label is displayed based on test data
      cy.get("[data-cy=prepend-label]").should("have.text", testData.label);
    });

    it("Should display the icon with label behind", () => {
      // Mount the component in a suspense wrapper
      cy.mount(TableCellIconComponent, { props: { data: { ...testData, position: TableIconPosition.Append } } });

      // Assert that the label is displayed based on test data
      cy.get("[data-cy=append-label]").should("have.text", testData.label);
    });
  });

  describe("Icon with tooltip", () => {
    const testData = {
      label: "Label Text",
      iconName: IconsLibrary.checkCircleOutline,
      color: "success",
      tooltip: "Tooltip Text",
      position: TableIconPosition.Prepend, // or 'append'
    };
    it("Should display the icon and tooltip when provided", () => {
      // Mount the component in a suspense wrapper
      cy.mount(TableCellIconComponent, { props: { data: testData } });

      // Assert that the tooltip is displayed based on test data
      cy.get("[data-cy=tooltip]").should("exist");

      // Hover over the icon to trigger the tooltip
      cy.get("[data-cy=icon]").trigger("mouseover");

      // Assert that the tooltip is displayed based on test data
      cy.get("[data-cy=tooltip]").should("contain", testData.tooltip);
    });
  });
});
