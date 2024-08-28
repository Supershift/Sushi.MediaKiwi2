import { View } from "@/models";
import { NavigationBuilder } from "@/navigation";

// create builder
const builder = new NavigationBuilder();

// section home
const homeView: View = { id: "Home", name: "Home", componentKey: "./views/Home.vue" };
const hotelsView: View = { id: "HotelOverview", name: "Hotels", componentKey: "./views/Hotels/HotelsOverview.vue" };
const hotelEditView: View = { id: "HotelEdit", name: "Hotel detail",  };
builder  
  .startSection("Home", "Home", "$home")
  .addNavigationItem("Home", "Home", homeView, "$home")
  .endSection()    
  .startSection("Hotels", "Hotels", "$hotel")
  .addNavigationItem("HotelOverview", "Hotels", hotelsView, "$hotel")
  .right()
  .addNavigationItem("HotelEdit", "Hotel detail", {componentKey: "./views/Hotels/HotelEdit.vue", parameterName: "hotelId"})  
  .addNavigationItem("RoomTypesOverview", "Room types", { componentKey: "./views/Hotels/RoomTypesOverview.vue", parameterName: "hotelId" })
  .right()
  .addNavigationItem("RoomTypesEdit", "Room type detail", { componentKey: "./views/Hotels/RoomTypesEdit.vue", parameterName: "roomTypeId" })
  .right()
  .addNavigationItem("RoomTypesEditDeep", "Room type edit deep", { componentKey: "./views/Hotels/RoomTypesEditDeep.vue", parameterName: "roomTypeId" })
  .left()
  .left()
  .addNavigationItem("SunbedTypes", "Sunbed types", { componentKey: "./views/Hotels/SunbedTypesOverview.vue", parameterName: "hotelId" })
  .addNavigationItem("HotelSendOffer", "Hotel Send Offer", { componentKey: "./views/Hotels/HotelSendOffer.vue", parameterName: "hotelId" })
  .left()
  .endSection()
  .startSection("Customers", "Customers")
  .addNavigationItem("CustomerOverview", "Customers", { componentKey: "./views/Customers.vue" })
  .endSection()
  .startSection('CRM', 'CRM')
  .addNavigationItem("Countries", "Countries", { componentKey: "./views/Countries.vue" })
  .addNavigationItem("CountriesEmpty", "Countries Empty state", { componentKey: "./views/CountriesEmpty.vue" })
  .endSection()
  .startSection("Account", "Account", "symbols:person")
  .addNavigationItem("Errors", "Errors", { componentKey: "./views/Account/ErrorSamples.vue" })
  .addNavigationItem("GetAccount", "Get Account", { componentKey: "./views/Account/GetAccount.vue" })
  .addChild("EditAccount", "Edit Account", { componentKey: "./views/Account/EditAccount.vue", parameterName: "accountId" })
  .endSection();

// build provider
const navigationProvider = builder.build();

export default navigationProvider;
