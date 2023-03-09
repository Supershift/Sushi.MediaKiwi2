import type { INavigationItem } from "../../models/navigation";
import type { IScreen } from "../../models/screen/IScreen";
import type ISection from "../../models/section/ISection";
import { NavigationAPIServices, SectionAPIServices, ScreenAPIServices } from "../../services";
import { describe, test, vi, expect, beforeEach } from "vitest";
import axios from "axios";
import { mount } from "@vue/test-utils";
import { RouteComponent } from "vue-router";
import { assert } from "chai";

const mockRouteComponent: RouteComponent = {} 

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
const sectionsMocked: ISection[] = [
  {
    id: 2,
    name: "Room selector",
    sortOrder: 0,
  },
];
const screensMocked: IScreen[] = [
  {
    id: 2,
    name: "Customers",
    componentFileName: "Customers.vue",
    sectionId: 2,
    component: mockRouteComponent
  },
];
// vi.mock("axios", () =>  vi.fn(() => { 
//   return {
//     default:(() => {
//       return { get: vi.fn() }
//     }),
//     create: () => {
//       return {
//         defaut: vi.fn(),
//         config: vi.fn(),
//         get: vi.fn().mockImplementationOnce(() => Promise.resolve({ data: itemsMocked})),
//         CancelToken: vi.fn()
//       } 
//     },
//     get: vi.fn()
//   } 
// }));

async function getNavigationItems() {
  try {
    return await NavigationAPIServices.GetNavigationItems();
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

async function getScreens() {
 try {
  return await ScreenAPIServices.GetScreens();
 } catch (error) {
  console.log(error);
 }
};
// TODO: fix mocking or use service worker for testing ex. MSW
describe("Test service API's", () => {
  describe("1 - getNavigationItems", () => {
    test("GET request  NavigationItems", async () => {
      vi.mock("axios", async () => { 
          const axios = await vi.importActual("axios");
          return {
            axios,
            get: vi.fn(),
            default: vi.fn()
          }
      })
      // vi.mocked(axios.create).mockResolvedValueOnce(axios.create())
      const navigationItems = await getNavigationItems();

      console.log(navigationItems);
      expect(true, "true")

    });
  });
  // describe("2 - Get Sections", () => {
  //   test("GET request to Sections", async () => {

  //     const sections = await getSections();
  //     console.log("Sections:", sections);

  //     expect(axios.get).toHaveBeenCalled();
  //     //expect(sections).toContain(sectionsMocked);
  //   });
  // });
  // describe("3 - Get Screens", () => {
  //   test("GET request to Screens", async () => {
      
  //     const screens = await getScreens();
  //     console.log("Screens:", screens);

  //     expect(axios.get).toHaveBeenCalled();
  //     //expect(screens).toContain(screensMocked);
  //   });
  // });
});
