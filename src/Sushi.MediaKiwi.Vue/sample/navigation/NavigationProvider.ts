import { NavigationBuilder } from "@/navigation";
import { FixedNavigationProvider } from "@/navigation/FixedNavigationProvider";

// create builder
const builder = new NavigationBuilder();

builder  
  .startSection("Home", "Home", "$home")
  .addNavigationItem("Home", "Home", "./views/Home.vue", undefined, "$home")
  .endSection()    
  .startSection("Hotels", "Hotels", "$hotel")
  .addNavigationItem("HotelOverview", "Hotels", "./views/Hotels/HotelsOverview.vue", undefined, "$hotel")
  .right()
  .addNavigationItem("HotelEdit", "Hotel detail", "./views/Hotels/HotelEdit.vue", "hotelId")  
  .addNavigationItem("RoomTypesOverview", "Room types", "./views/Hotels/RoomTypesOverview.vue", "hotelId")
  .right()
  .addNavigationItem("RoomTypesEdit", "Room type detail", "./views/Hotels/RoomTypesEdit.vue", "roomTypeId")
  .right()
  .addNavigationItem("RoomTypesEditDeep", "Room type edit deep", "./views/Hotels/RoomTypesEditDeep.vue", "roomTypeId")
  .left()
  .left()
  .addNavigationItem("SunbedTypes", "Sunbed types", "./views/Hotels/SunbedTypesOverview.vue", "hotelId")
  .addNavigationItem("HotelSendOffer", "Hotel Send Offer", "./views/Hotels/HotelSendOffer.vue", "hotelId")
  .left()
  .endSection()
  .startSection("Customers", "Customers")
  .addNavigationItem("CustomerOverview", "Customers", "./views/Customers.vue" )
  .endSection()
  .startSection('CRM', 'CRM')
  .addNavigationItem("Countries", "Countries", "./views/Countries.vue")
  .addNavigationItem("CountriesEmpty", "Countries Empty state", "./views/CountriesEmpty.vue")
  .endSection()
  .startSection("Account", "Account", "symbols:person")
  .addNavigationItem("Errors", "Errors", "./views/Account/ErrorSamples.vue" )
  .addNavigationItem("GetAccount", "Get Account", "./views/Account/GetAccount.vue")
  .addChild("EditAccount", "Edit Account", "./views/Account/EditAccount.vue", "accountId")
  .endSection();

// build provider
const navigationTree = builder.build();

export default new FixedNavigationProvider(navigationTree);
