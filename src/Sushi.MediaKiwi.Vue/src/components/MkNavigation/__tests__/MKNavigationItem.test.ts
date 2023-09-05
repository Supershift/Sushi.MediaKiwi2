/* eslint-disable no-unused-labels */
import "reflect-metadata";
import MKNavigationItemComponent from "../MkNavigationItem.vue";
import { describe, expect, vi, beforeEach } from "vitest";
import { container } from "tsyringe";
import { mountAsync } from "@test/utils/mount";
import { NavigationItem } from "@/models";

// mock libraries
vi.mock("i18next");
vi.mock("@azure/msal-browser");
vi.mock("navigation");
vi.mock("store");

describe("MKNavigationItem", () => {

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
                    parent: 
                    {
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
                parent: 
                {
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
            }
        ] as Array<NavigationItem>,
    };

    beforeEach(() => {
      container.reset();
      vi.clearAllMocks();
    });
    afterEach(() => {
        vi.resetAllMocks();
    });
  
    it("Should be rendered", async () => {
        // Mount the component in a suspense wrapper
        const wrapper = await mountAsync(MKNavigationItemComponent, withChildProps);
    
        // Check that the component is rendered and contains an icon
        const outputHtml = wrapper.html();
        expect(outputHtml).toBeTruthy(); // Everything in JavaScript is truthy, except false, 0, '', null, undefined, and NaN.
        expect(outputHtml).toContain("v-list-item");
    });
  
    it("Title is set", async () => {
        // Mount the component in a suspense wrapper
        const wrapper = await mountAsync(MKNavigationItemComponent, withChildProps);
    
        // Check that the component is rendered and contains an icon 
        const outputHtml = wrapper.html();
        expect(outputHtml).toBeTruthy(); // Everything in JavaScript is truthy, except false, 0, '', null, undefined, and NaN.
        expect(outputHtml).toContain("v-list-item");
        // make sure the title is set
        expect(outputHtml).toContain("Test Item");
    });

    it("Prepend icon is set", async () => {
        vi.mock("IconsLibrary");
        // Mount the component in a suspense wrapper
        const wrapper = await mountAsync(MKNavigationItemComponent, withOutChildProps);
    
        // Check that the component is rendered and contains an icon 
        const outputHtml = wrapper.html();
        expect(outputHtml).toBeTruthy(); // Everything in JavaScript is truthy, except false, 0, '', null, undefined, and NaN.
        expect(outputHtml).toContain("v-list-item");
        // check if icons is right set and is called
        expect(wrapper.vm.$vuetify.icons.aliases).not.toBeNull();
        expect(wrapper.vm.$vuetify.icons.aliases?.ratingFull).toEqual("mdi-star"); // we use a default icon instead since we're testing the icon
        expect(wrapper.vm.$vuetify.icons.defaultSet).toEqual("mdi");
        // make sure the icon is set
        expect(outputHtml).toContain("v-list-item__prepend");
        console.log(wrapper.vm.$vuetify.icons.aliases);
    });

      
    it("Should have children", async () => {
        // Mount the component in a suspense wrapper
        const wrapper = await mountAsync(MKNavigationItemComponent, withChildProps);
    
        // Check that the component is rendered and contains an icon 
        const outputHtml = wrapper.html();
        expect(outputHtml).not.toBeNull();
        expect(outputHtml).not.toBeUndefined();
        expect(outputHtml).not.toEqual("");
        expect(outputHtml).toContain("v-list-item");
        // make sure it has children
        expect(outputHtml).toContain("v-list-group");
        // makes sure we have an icon (chevron at the back)
        expect(outputHtml).toContain("v-list-item__append");
        // makes sure the child is named correctly
        expect(outputHtml).toContain("Test Child Item");
    });
    
  });