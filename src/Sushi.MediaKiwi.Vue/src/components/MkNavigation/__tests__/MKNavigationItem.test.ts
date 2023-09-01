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

describe("MKNavigationItem", () => {

    // Declare the props to be used in all tests
    const props = {
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
                    },
                    viewId: "home",
                    path: "/home/child",  
                },
            ] as Array<NavigationItem>,
        } as NavigationItem,
        allItems: [
            {
                id: 123,
                name: "Test Item",
                sectionId: 1,
                path: "/home",  
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
                },
                viewId: "home",
                path: "/home/child",  
            },
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
        const wrapper = await mountAsync(MKNavigationItemComponent, props);
    
        // Check that the component is rendered and contains an icon
        const outputHtml = wrapper.html();
        expect(outputHtml).not.toBeNull();
        expect(outputHtml).not.toBeUndefined();
        expect(outputHtml).not.toEqual("");
        expect(outputHtml).toContain("v-list-item");
    });
  
    it("Title is set", async () => {
        // Mount the component in a suspense wrapper
        const wrapper = await mountAsync(MKNavigationItemComponent, props);
    
        // Check that the component is rendered and contains an icon 
        const outputHtml = wrapper.html();
        expect(outputHtml).not.toBeNull();
        expect(outputHtml).not.toBeUndefined();
        expect(outputHtml).not.toEqual("");
        expect(outputHtml).toContain("v-list-item");
        // make sure the title is set
        expect(outputHtml).toContain("Test Item");
    });
      
    it("Should have children", async () => {
        // Mount the component in a suspense wrapper
        const wrapper = await mountAsync(MKNavigationItemComponent, props);
    
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