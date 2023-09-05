/* eslint-disable no-unused-labels */
import "reflect-metadata";
import MKBackButtonComponent from "../MkBackButton.vue";
import { describe, expect, vi, beforeEach } from "vitest";
import { container } from "tsyringe";
import { mountAsync } from "@test/utils/mount";
import { IconsLibrary } from "@/models";

// mock libraries
vi.mock("i18next");
vi.mock("@azure/msal-browser");
vi.mock("IconsLibrary");

describe("MKBackButton", () => {

    beforeEach(() => {
      container.reset();
      vi.clearAllMocks();
      // mock the icon since it not nessary for this test
      vi.spyOn(IconsLibrary, "arrowLeft", "get").mockClear();
    });
    afterEach(() => {
        vi.resetAllMocks();
    });
  
    it("Should be rendered", async () => {

        // Mount the component in a suspense wrapper
        const wrapper = await mountAsync(MKBackButtonComponent);
    
        // Check that the component is rendered and contains an icon 
        const outputHtml = wrapper.html();
        expect(outputHtml).not.toBeNull();
        expect(outputHtml).not.toBeUndefined();
        expect(outputHtml).not.toEqual("");
        expect(outputHtml).toContain("v-btn");
    });

    it('Should navigate', async () => {
        // Mock the necessary dependencies
        const router = {
          push: vi.fn(),
          back: vi.fn(),
        };
    
        const wrapper = await mountAsync(MKBackButtonComponent);
        // Check that the component is rendered and contains an icon 
        const outputHtml = wrapper.html();
        expect(outputHtml).toContain("v-btn");

        // Simulate a click on the button
        wrapper.find("button").trigger("click");
    
        // Expect router.push to have been called 
        vi.spyOn(router, 'push').mockReturnValue("push");
        
        // Ensure router.back is not called
        expect(router.back).not.toHaveBeenCalled();
        
    });
    
  });