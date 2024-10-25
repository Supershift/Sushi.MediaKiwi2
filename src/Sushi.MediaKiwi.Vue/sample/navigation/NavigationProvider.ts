import { MkLayout } from "@/constants";
import { NavigationBuilder } from "@/navigation";
import { FixedNavigationProvider } from "@/navigation/FixedNavigationProvider";
import { useRoomTypes } from "@sample/composables/useRoomTypes";
import { HotelConnector } from "@sample/services/HotelConnector";
import { container } from "tsyringe";

const { getRoomType, getBoardType } = useRoomTypes();

// create builder
const builder = new NavigationBuilder();

builder
  .startSection("Home", "Home", "$home")
  .addNavigationItem("Home", "Home", "./views/Home.vue", undefined, "$home")
  .endSection()
  .startSection("Hotels", "Hotels", "$hotel")
  .addNavigationItem("HotelOverview", "Hotels", "./views/Hotels/HotelsOverview.vue", undefined, "$hotel", MkLayout.Full)
  .right()
  .addNavigationItem("HotelEdit", "Details", "./views/Hotels/HotelEdit.vue", "hotelId", undefined, undefined, async (hotelId) => {
    const hotelConnector = container.resolve(HotelConnector);
    const candidate = await hotelConnector.GetAsync(hotelId);
    return candidate?.name;
  })
  .addNavigationItem("RoomTypesOverview", "Room types", "./views/Hotels/RoomTypesOverview.vue", "hotelId")
  .right()
  .addNavigationItem("RoomTypesEdit", "Details", "./views/Hotels/RoomTypesEdit.vue", "roomTypeId", undefined, undefined, async (id) => {
    const result = await getRoomType(parseInt(id));
    return result?.name;
  })
  .addNavigationItem("BoardTypesOverview", "Board types", "./views/Hotels/BoardTypesOverview.vue", "roomTypeId")
  .right()
  .addNavigationItem("BoardTypeEdit", "Details", "./views/Hotels/BoardTypeEdit.vue", "boardTypeId", undefined, undefined, async (id) => {
    const result = await getBoardType(parseInt(id));
    return result?.name;
  })
  .left()
  .left()
  .addNavigationItem("SunbedTypes", "Sunbed types", "./views/Hotels/SunbedTypesOverview.vue", "hotelId")
  .addNavigationItem("HotelSendOffer", "Hotel Send Offer", "./views/Hotels/HotelSendOffer.vue", "hotelId")
  .left()
  .endSection()
  .startSection("Customers", "Customers")
  .addNavigationItem("CustomerOverview", "Customers", "./views/Customers.vue", undefined, "$customer", "CustomLayout")
  .endSection()
  .startSection("CRM", "CRM")
  .addNavigationItem("Countries", "Countries", "./views/Countries.vue")
  .right()
  .addNavigationItem("CountryEdit", "Country", "./views/CountryEdit.vue", "countryId")
  .left()
  .addNavigationItem("CountriesEmpty", "Countries Empty state", "./views/CountriesEmpty.vue")
  .endSection()
  .startSection("Account", "Account", "symbols:person")
  .addNavigationItem("Errors", "Errors", "./views/Account/ErrorSamples.vue")
  .addNavigationItem("GetAccount", "Get Account", "./views/Account/GetAccount.vue")
  .addChild("EditAccount", "Edit Account", "./views/Account/EditAccount.vue", "accountId")
  .endSection();

// build provider
const navigationTree = builder.build();

export default new FixedNavigationProvider(navigationTree);
