import { HotelConnector } from "../services/HotelConnector";
import { container } from "tsyringe";

export function useSectionRules() {
  // Inject depecency
  const hotelConnector = container.resolve(HotelConnector);

  async function hasAvailableHotels(): Promise<boolean> {
    const hotels = await hotelConnector.GetAllAsync();
    const hasHotels = !(hotels?.totalCount && hotels.totalCount > 0) || false;
    return hasHotels === false;
  }

  return {
    hasAvailableHotels,
  };
}
