/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseToNestedObject, mergeDeep } from "./objectHelper.js";
/**
 * Filters for the source properties with the provided prefix.
 * @param {string} prefix
 * @returns {object} source of filtered values
 */
export function getSection(prefix: string): object {
  // Filter and build new object based on source
  const values = Object.keys(process.env)
    .filter((key) => key.toLowerCase().includes(prefix.toLowerCase()))
    .reduce((cur: any, key: any) => {
      // get the appsetting value
      const value = process.env[key] as string;

      // parse the key to an object
      const result = parseToNestedObject(key, value);

      // merge with the current result object
      const mergedObj = mergeDeep(cur, result);

      // return the merged object
      return mergedObj;
    }, {});

  return values as object;
}
