// remember to add the icons to the "../models/enum/Icons.ts" file so they are typesafe in the app an can be used whithin the MKVue project
import { IconOptions } from "vuetify/lib/framework.mjs";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { mediakiwiIconAliases } from "./IconAliases";
import { symbols, aliases as symbolsAliasses } from "./material/symbols";

// custom Icon options for mdi svgs
export const MediakiwiIconOptions: IconOptions = {
  defaultSet: "mdi",
  aliases: {
    ...aliases,
    ...mediakiwiIconAliases,
    ...symbolsAliasses,
  },
  sets: {
    symbols,
    mdi,
  },
};
export { mediakiwiIconAliases };
