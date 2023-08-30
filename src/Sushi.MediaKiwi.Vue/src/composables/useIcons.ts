import { IconsLibrary } from "@/models";

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
    return icon; // when its external we don't check the validity of the icon, since we have no clue how to act....its entirely up to the developer
  }
  return isValidIcon(icon) == true ? icon : IconsLibrary.unknown; // only check the validity when we are not using external Icons
}
