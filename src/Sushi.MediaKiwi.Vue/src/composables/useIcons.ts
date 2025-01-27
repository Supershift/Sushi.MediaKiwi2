import { IconsLibrary } from "@/models";
import { inject } from "vue";
import { VuetifyOptions } from "vuetify";

/**
 * Check if the icon is valid by asserting that it is a value of the IconsLibrary enum
 * @param icon string or undefined
 * @returns boolean
 */
function isValidIcon(icon?: string): boolean {
  if (!icon) {
    return false;
  }
  return Object.values(IconsLibrary).includes(icon as IconsLibrary); // Use a type assertion here
}

/** Parse the icon value to ensure we always have an icon to show
 * @param icon string or undefined
 * @returns string
 */
export function parseIconValue(icon?: string, external?: boolean): string {
  if (!icon) {
    return IconsLibrary.unknown; // when none is present we use the mdiUnknown icon (squareblank)
  }
  if (external) {
    const vuetifyOptions = inject("vuetifyOptions") as VuetifyOptions;

    // Parse the alias for the icon by removing the $ prefix
    const alias = icon.replace("$", "");

    // Check if the alias is present in the vuetify options
    if (vuetifyOptions.icons?.aliases?.[alias]) {
      return icon;
    }

    // Check if the alias is a symbols or mdi alias
    if (alias.startsWith("symbols:")) {
      return icon;
    } else if (alias.startsWith("mdi:")) {
      return icon;
    }

    // Return the mdiUnknown icon when the alias is not present to prevent breaking the entire application
    return IconsLibrary.unknown;
  }
  return isValidIcon(icon) == true ? icon : IconsLibrary.unknown; // only check the validity when we are not using external Icons
}
