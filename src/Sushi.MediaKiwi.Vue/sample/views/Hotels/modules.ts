import { RouteComponent } from "vue-router";
import HotelEdit from "./HotelEdit.vue";
import HotelSendOffer from "./HotelSendOffer.vue";
import HotelsOverview from "./HotelsOverview.vue";
import HotelsOverviewTableMap from "./HotelsOverview_TableMap.vue";
import RoomTypesEdit from "./RoomTypesEdit.vue";
import RoomTypesEditDeep from "./RoomTypesEditDeep.vue";
import RoomTypesOverview from "./RoomTypesOverview.vue";
import SunbedTypesOverview from "./SunbedTypesOverview.vue";

const modules: Record<string, RouteComponent> = {
  HotelEdit,
  HotelSendOffer,
  HotelsOverview,
  HotelsOverviewTableMap,
  RoomTypesEdit,
  RoomTypesEditDeep,
  RoomTypesOverview,
  SunbedTypesOverview,
};

export { modules };
