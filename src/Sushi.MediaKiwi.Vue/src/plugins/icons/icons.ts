// remember to add the icons to the "../models/enum/Icons.ts" file so they are typesafe in the app an can be used whithin the MKVue project
import { IconOptions } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { mediakiwiIconAliases } from "./IconAliases";

// custom Icon options for mdi svgs
export const MediakiwiIconOptions: IconOptions = {
  defaultSet: "mdi", // is already default
  aliases: {
    ...aliases,
    ...mediakiwiIconAliases,
  },
  sets: {
    mdi,
  },
};
export { mediakiwiIconAliases };
