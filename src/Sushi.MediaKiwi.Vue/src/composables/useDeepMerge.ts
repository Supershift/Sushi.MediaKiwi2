/**
 * Utility to recursively merges multiple objectes into a single object. Retaining all properties and nested objects.
 * @example
 * const obj1 = {
 *   foo: {
 *     prop1: 42,
 *   },
 * };
 *
 * const obj2 = {
 *   foo: {
 *     prop2: 21,
 *   },
 *   bar: {
 *     prop3: 10,
 *   },
 * };
 *
 * When using DeepMerge:
 * const result = {
 *   foo: {
 *     prop1: 42,
 *     prop2: 21,    // `obj2.foo` got merged into `obj1.foo`.
 *   },
 *   bar: {
 *     prop3: 10,
 *   },
 * };
 *
 * Regular Shallow Merge when using Object.assign or the spread operator (...):
 * const result = {
 *   foo: {          // `foo` got overwritten with the value of `obj2`
 *     prop2: 21,
 *   },
 *   bar: {
 *     prop3: 10,
 *   },
 * };
 */
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
   * Utility function to recursively merge `target` and `source` into a single object.
   * Where the Spread operator {...} only performs a shallow merge, this function performs a deep merge, combining nested objects and their properties.
   * When a property exists on both the `target` and `source` objects, the value of the `source` object will be used.
   * @param target The target object into which the `source` object will be merged. If `source` is falsy (null or undefined), the function returns the `target` object without any modifications.
   * @param source The source object whose properties will be merged into the `target` object. If `source` is falsy, the function returns the `target` object without any modifications.
   */
  function deepMerge(target: any, source: any): any {
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
          deepMerge(target[key], source[key]);
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

  return { isObject, deepMerge };
}
