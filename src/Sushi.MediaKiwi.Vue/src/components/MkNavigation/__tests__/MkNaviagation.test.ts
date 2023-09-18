import "reflect-metadata";
import MkNavigationComponent from "../MkNavigation.vue";
import { describe, expect, vi, beforeEach } from "vitest";
import { container } from "tsyringe";
import { mountAsync } from "@test/utils/mount";

// mock libraries
vi.mock("@/router/routerManager");
vi.mock("@/composables/useNavigation");
vi.mock("@/composables/useNavigation");

describe("MkNavigation", () => {

    beforeEach(() => {
        container.reset();
        vi.clearAllMocks();
    });
    afterEach(() => {
        vi.resetAllMocks();
    });

    // TODO: Mock the routemanager and test the component
    it.skip("Should be rendered", async () => {

        // Mount the component in a suspense wrapper
        const wrapper = await mountAsync(MkNavigationComponent);

        // Check that the component is rendered and contains an icon 
        const outputHtml = wrapper.html();
        expect(outputHtml).toBeTruthy(); // Everything in JavaScript is truthy, except false, 0, '', null, undefined, and NaN.
        expect(outputHtml).toContain("v-list");
    });

  });