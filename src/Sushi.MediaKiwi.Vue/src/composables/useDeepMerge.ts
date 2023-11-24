export function useDeepMerge() {
  /**
   * Check if the input item is an object
   * @param {any} item
   * @returns {boolean}
   */
  function isObject(item: any): boolean {
    return item && typeof item === "object";
  }

  /**
   * Recursivly deep merges two objects
   * @param target
   * @param ...sources
   */
  function mergeDeep(target: any, source: any): any {
    if (!source) {
      return target;
    }

    // Check both target and source are objects
    if (isObject(target) && isObject(source)) {
      // Loop though the source keys
      for (const key in source) {
        // Check for begin an object
        if (isObject(source[key])) {
          // Add the properry if it doesn't yet exists on the target object
          if (!target[key]) {
            Object.assign(target, { [key]: {} });
          }

          // Merge the source value to the target value (recursive)
          mergeDeep(target[key], source[key]);
        } else {
          // Set the value on the target object
          Object.assign(target, { [key]: source[key] });
        }
      }
    } else {
      return target;
    }

    // Return the updated target object
    return target;
  }

  return { isObject, mergeDeep };
}
