import type { INavigationItem } from "@/models/navigation";
import type { IScreen } from "@/models/screen/IScreen";
import type ISection from "@/models/section/ISection";
import { NavigationAPIServices, SectionAPIServices, ScreenAPIServices } from "@/services";
import axios from "axios";
import { describe, test, vi, expect } from "vitest";

vi.mock("axios");
const testSectionId = 2;

async function getNavigationItems(sectionId: number) {
  try {
    return await NavigationAPIServices.GetNavigationItems(sectionId);
  } catch (error) {
    console.log(error);
  }
};

async function getSections() {
  try {
    return  await SectionAPIServices.GetSections();
  } catch (ex) {
    console.log(ex);
  }
}

async function getScreens(sectionId: number) {
 try {
  return await ScreenAPIServices.GetScreens(sectionId);
 } catch (error) {
  console.log(error);
 }
};

describe("Test service API's", () => {
  describe("1 - Get NavigationItems", () => {
    test("GET request  NavigationItems", async () => {
      const itemsMocked: INavigationItem[] = [
        {
          id: 1,
          name: "Hotels",
          screenId: 1,
          typeId: 3,
          sectionId: 1,
          parentNavigationItemId: null,
          path: "/",
        },
      ];
      const navigationItems = await getNavigationItems(testSectionId);
      console.log("NavigationItems:", navigationItems);

      expect(axios.get).toHaveBeenCalled();
      //expect(navigationItems).toContain(itemsMocked);
    });
  });
  describe("2 - Get Sections", () => {
    test("GET request to Sections", async () => {
      const itemsMocked: ISection[] = [
        {
          id: 2,
          name: "Room selector",
          sortOrder: 0,
        },
      ];
      const sections = await getSections();
      console.log("Sections:", sections);

      expect(axios.get).toHaveBeenCalled();
      //expect(sections).toContain(itemsMocked);
    });
  });
  describe("3 - Get Screens", () => {
    test("GET request to Screens", async () => {
      const itemsMocked: IScreen[] = [
        {
          id: 2,
          name: "Customers",
          componentFileName: "Customers.vue",
          sectionId: 2,
        },
      ];
      const screens = await getScreens(testSectionId);
      console.log("Screens:", screens);

      expect(axios.get).toHaveBeenCalled();
      //expect(screens).toContain(itemsMocked);
    });
  });
});
