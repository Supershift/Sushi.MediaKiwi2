import { NavigationBuilder } from "@/navigation";
import { FixedNavigationProvider } from "@/navigation/FixedNavigationProvider";

// create builder
const builder = new NavigationBuilder();

builder
  .startSection("Home", "Home", "$home")
  .addNavigationItem("Home", "Home", "./home/views/Home.vue", undefined, "$home")
  .endSection()
  .startSection("Hotels", "Hotels", "symbols:apartment")
  .addNavigationItem("HotelOverview", "Hotels", "./hotels/views/HotelsOverview.vue", undefined, "$hotel", "custom-css-layout")
  .right()
  .addNavigationItem("HotelEdit", "Hotel detail", "./hotels/views/HotelEdit.vue", "hotelId")
  .addNavigationItem("RoomTypesOverview", "Room types", "./hotels/views/RoomTypesOverview.vue", "hotelId")
  .right()
  .addNavigationItem("RoomTypesEdit", "Room type detail", "./hotels/views/RoomTypesEdit.vue", "roomTypeId")
  .addNavigationItem("BoardTypesOverview", "Board types", "./hotels/views/BoardTypesOverview.vue", "roomTypeId")
  .right()
  .addNavigationItem("BoardTypeEdit", "Board type detail", "./hotels/views/BoardTypeEdit.vue", "boardTypeId")
  .left()
  .left()
  .addNavigationItem("SunbedTypes", "Sunbed types", "./hotels/views/SunbedTypesOverview.vue", "hotelId")
  .addNavigationItem("HotelSendOffer", "Hotel Send Offer", "./hotels/views/HotelSendOffer.vue", "hotelId")
  .left()
  .endSection()
  .startSection("Customers", "Customers", "symbols:group")
  .addNavigationItem("CustomerOverview", "Customers", "./customers/views/Customers.vue", undefined, "$customer", "custom-css-layout")
  .endSection()
  .startSection("CRM", "CRM", "symbols:manage_accounts")
  .addNavigationItem("Countries", "Countries", "./countries/views/Countries.vue")
  .right()
  .addNavigationItem("CountryEdit", "Country", "./countries/views/CountryEdit.vue", "countryId")
  .left()
  .addNavigationItem("CountriesEmpty", "Countries (Empty state)", "./countries/views/CountriesEmpty.vue")
  .addNavigationItem("CountriesEmptyCustomActions", "Countries (Custom Empty state)", "./countries/views/CountriesEmptyCustomActions.vue")
  .endSection()
  .startSection("Account", "Account", "symbols:person")
  .addNavigationItem("GetAccount", "Get Account", "./crm/views/GetAccount.vue")
  .addChild("EditAccount", "Edit Account", "./crm/views/EditAccount.vue", "accountId")
  .endSection()
  .startSection("Settings", "Settings", "symbols:settings")
  .addNavigationItem("MkLocaleOverview", "Localization", "MkLocaleOverview")
  .addChild("MkLocaleEdit", "Edit Localization", "MkLocaleEdit", "localeId")
  .addNavigationItem("MkStyleGuideView", "Style Guide", "MkStyleGuideView")
  .addNavigationItem("Errors", "Errors", "./settings/views/ErrorSamples.vue")
  .addNavigationItem("Filters", "Filters", "./settings/views/FiltersOverview.vue")
  .endSection();

// build provider
const navigationTree = builder.build();

export default new FixedNavigationProvider(navigationTree);
