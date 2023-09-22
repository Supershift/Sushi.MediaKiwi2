import "reflect-metadata";
import MkNavigationRailComponent from "../MkNavigationRail.vue";
import { describe, expect, vi, beforeEach } from "vitest";
import { container } from "tsyringe";
import { mountAsync, mountWithLayoutAsync, mount } from "@test/utils/mount";
import { Section } from "@/models";

// mock libraries
vi.mock("@/composables/useNavigation", () => {
    return {
        useNavigation: () => {
            return {
                navigateTo: () => {
                    return Promise.resolve();
                },
                determineIfSectionIsActive: () => {
                    return true;
                }
            };
        },
    };
});

describe("MkNavigation", () => {
    // Declare the props to be used in all tests
    const props = {
        railItems: [
            {
                id: 1,
                name: "Section One",
                sortOrder: 0,
                icon: "$arrowLeft",
            },
        ] as Array<Section>,
    };
    beforeEach(() => {
        container.reset();
        vi.clearAllMocks();
        global.ResizeObserver = class ResizeObserver {
            observe() {
              // do nothing
            }
            unobserve() {
              // do nothing
            }
            disconnect() {
              // do nothing
            }
          };
    });
    afterEach(() => {
        vi.resetAllMocks();
    });

    it("Should be rendered", async () => {
        // TODO: Fix this test - we are missing the layout component or the ResizeObserver when trying to mount (https://github.com/jsdom/jsdom/issues/3368)
        // According to the issue, we should use Cypress for non headless testing (browser based testing) and jsdom/vitest for headless testing 
        // Mount the component in a suspense wrapper
        const wrapper = await mountWithLayoutAsync(MkNavigationRailComponent, props);

        // Check that the component is rendered and contains an icon 
        const outputHtml = wrapper.html();
        expect(outputHtml).toBeTruthy(); // Everything in JavaScript is truthy, except false, 0, '', null, undefined, and NaN.
        console.log(outputHtml);
        
        expect(outputHtml).toContain("v-list");
    });

  });