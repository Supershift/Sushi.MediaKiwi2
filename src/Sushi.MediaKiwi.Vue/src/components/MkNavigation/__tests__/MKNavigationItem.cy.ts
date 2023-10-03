/* eslint-disable no-unused-labels */
import "reflect-metadata";
import MkNavigationItemComponent from "../MkNavigationItem.vue";
import { NavigationItem } from "@/models";
import { createVuetify } from "vuetify";
import defaultVuetifyOptions from "@/plugins/vuetify";

// mock libraries
// vi.mock("i18next");
// vi.mock("@azure/msal-browser");
// vi.mock("navigation");
// vi.mock("store");

// Declare the props to be used in all tests
const withChildProps = {
  navigationItem: {
    id: 123,
    name: "Test Item",
    sectionId: 1,
    path: "/home",
    children: [
      {
        id: 444,
        name: "Test Child Item",
        sectionId: 1,
        parentNavigationItemId: 123,
        parent: {
          id: 123,
          name: "Test Item",
          sectionId: 1,
          path: "/home",
          icon: "$ratingFull", // we use a default icon instead since we're testing the icon
        },
        viewId: "home",
        path: "/home/child",
        icon: "$ratingFull", // we use a default icon instead since we're testing the icon
      },
    ] as Array<NavigationItem>,
  } as NavigationItem,
  allItems: [
    {
      id: 123,
      name: "Test Item",
      sectionId: 1,
      path: "/home",
      icon: "$home",
    },
    {
      id: 444,
      name: "Test Child Item",
      sectionId: 1,
      parentNavigationItemId: 123,
      parent: {
        id: 123,
        name: "Test Item",
        sectionId: 1,
        path: "/home",
        icon: "$home",
      },
      viewId: "home",
      path: "/home/child",
    },
  ] as Array<NavigationItem>,
};

const withOutChildProps = {
  navigationItem: {
    id: 123,
    name: "No Child Test Item",
    sectionId: 1,
    path: "/ratings",
    icon: "$ratingFull", // we use a default icon instead since we're testing the icon
    children: [] as Array<NavigationItem>,
  } as NavigationItem,
  allItems: [
    {
      id: 123,
      name: "No Child Test Item",
      sectionId: 1,
      path: "/ratings",
      icon: "$ratingFull", // we use a default icon instead since we're testing the icon
    },
  ] as Array<NavigationItem>,
};

describe("<MkNavigationItem />", () => {
  it("Should be rendered", () => {
    // Mount the component in a suspense wrapper
    cy.mount(MkNavigationItemComponent, { props: withChildProps });

    cy.get(".v-list-item").should("exist");
  });

  it("Should have title", () => {
    // Mount the component in a suspense wrapper
    cy.mount(MkNavigationItemComponent, { props: withChildProps });

    // Check that the component is rendered and contains an icon
    // make sure the title is set
    cy.get(".mk-navigation-item").should("contain", "Test Item");
  });

  it("Should have prepend icon", () => {
    // create our own vuetify instance
    const vuetify = createVuetify(defaultVuetifyOptions);

    // Mount the component in a suspense wrapper
    cy.mount(MkNavigationItemComponent, { vuetify, props: withOutChildProps });

    expect(vuetify.icons.aliases).not.to.be.null;
    expect(vuetify.icons.aliases?.ratingFull).to.equal("M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"); // we use a default icon instead since we're testing the icon (mdi-star path values)
    expect(vuetify.icons.defaultSet).to.equal("mdi");
  });

  it("Should have children", async () => {
    // Mount the component in a suspense wrapper
    cy.mount(MkNavigationItemComponent, { props: withChildProps });

    // Check that the component is rendered has children
    // Make sure the child is named correctly
    const listGroupElement = cy.get(".v-list-group");
    listGroupElement.should("exist");

    const listItemsElement = cy.get(".v-list-group__items .v-list-item__content");
    listItemsElement.should("contain.text", "Test Child Item");

    // makes sure we have an icon (chevron at the back)
    const appendElement = cy.get(".v-list-item__append");
    appendElement.should("exist");
  });
});
