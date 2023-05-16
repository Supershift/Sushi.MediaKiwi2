/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * nameof<View>((x) => x.name); = "name"
 * @param {(entity: Type) => string | number | boolean | object | undefined} func
 * @return {string} Property name as string
 */
export function nameof<Type>(func: (entity: Type) => string | number | boolean | object | undefined): string {
  try {
    const fnStr = func.toString();
    // "x => x.prop"
    if (fnStr.includes("=>")) {
      return fnStr.substring(fnStr.lastIndexOf(".") + 1);
    }
  } catch (err) {
    console.error("Invalid nameof operation", err);
  }
  return "";
}
