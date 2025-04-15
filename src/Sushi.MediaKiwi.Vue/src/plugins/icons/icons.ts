// remember to add the icons to the "../models/enum/Icons.ts" file so they are typesafe in the app an can be used whithin the MKVue project
import { IconOptions } from "vuetify";
import { mdi } from "vuetify/iconsets/mdi-svg";
import { mdiAliases } from "./mdi/Aliases";
import { symbols, symbolsAliases } from "./symbols";

// custom Icon options for mdi svgs
export const MediakiwiIconOptions: IconOptions = {
  defaultSet: "mdi", // Leave MDI as the default icon set
  aliases: {
    ...mdiAliases, // Add the mdi aliases
    ...symbolsAliases, // Add the symbols aliases
  },
  sets: {
    symbols, // Add the symbols set
    mdi, // Add the mdi set
  },
};

// export the custom icon options
export { mdiAliases };
export { symbolsAliases };
