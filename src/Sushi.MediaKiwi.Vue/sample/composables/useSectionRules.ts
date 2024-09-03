import { useMediakiwiStore } from "@/stores";
import { HotelConnector } from "../services/HotelConnector";
import { container } from "tsyringe";
import { SectionDisplayState } from "@/models/navigation";

export function useSectionRules() {
  // Inject depecency
  const hotelConnector = container.resolve(HotelConnector);
  const mediakiwiStore = useMediakiwiStore();
  

  /**
   * Check if there are available hotels
   */
  async function hasAvailableHotels(): Promise<boolean> {
    const hotels = await hotelConnector.GetAllAsync();
    const hasHotels = !(hotels?.totalCount && hotels.totalCount > 0) || false;
    return hasHotels;
  }

  /**
   * Disable or enable the hotel section based on the availability of hotels
   */
  function setHotelSectionDisplayState(value: SectionDisplayState = undefined) {
    // first check if store is initialized
    // mediakiwiStore.init().then(async () => {
    //   const section = mediakiwiStore.navigationTree.sections.find((x) => x.id === "TestSection");
    //   if (section) {
    //     // Preset true to disable the section
    //     section.displayState = "disabled";

    //     if (!value) {
    //       // Set the section to disabled based on the availability of hotels
    //       const result = await hasAvailableHotels();
    //       if (!result) {
    //         section.displayState = undefined;
    //         section.tooltip = undefined;
    //       }
    //     } else {
    //       section.displayState = value;
    //       section.tooltip = "No hotels available";
    //     }
    //   }
    // });
  }

  return {
    setHotelSectionDisplayState,
  };
}
