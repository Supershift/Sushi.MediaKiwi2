/**
 * Filters for the process.env properties with the provided prefix.
 * @param {string} prefix
 * @returns {object} Object of filtered values
 */
function getValues(prefix) {
  // Filter and build new object based on process.env
  const values = Object.keys(process.env)
    .filter((key) => key.toLowerCase().includes(prefix.toLowerCase()))
    .reduce((cur, key) => {
      // get the appsetting value
      const value = process.env[key];

      // parse the key to an object
      const result = parseToNestedObject(key, value);

      // merge with the current result object
      const mergedObj = mergeDeep(cur, result);

      // return the merged object
      return mergedObj;
    }, {});

  return values;
}

/**
 * Parses a colon separated key to an object with the deepest level containing the value
 * @param {string} key MediaKiwi:msalConfig:auth:tenantId
 * @param {string} value some-value
 * @returns {*} { "mediaKiwi": { "msalConfig": { "auth": { "tenantId": "some-value" } } } }
 */
function parseToNestedObject(key, value) {
  if (!key) {
    return {};
  }

  // Split the key by colon
  const keyParts = key.split(":");
  let index = 0;
  let result = {};

  // Loop though the part in reverse order
  for (const keyPart of keyParts.reverse()) {
    // parse the keyPart to a json valid property name
    const propertyName = parseKey(keyPart);
    if (!index) {
      // Set the value for the deepest level
      // E.g. "tenantId": "some-value"
      Object.assign(result, { [propertyName]: parseValue(value) });
    } else {
      // Set the current result object as a property on the new object
      // E.g. { "tenantId": "some-value" } to { auth: { "tenantId": "some-value"} }
      result = { [propertyName]: result };
    }
    // Increment the index to get higher up in the nested properties
    index++;
  }

  // Return the new created result
  return result;
}

/**
 * Check if the input item is an object
 * @param {any} item
 * @returns {boolean}
 */
function isObject(item) {
  return item && typeof item === "object";
}

/**
 * Recursivly deep merges two objects
 * @param target
 * @param ...sources
 */
function mergeDeep(target, source) {
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
  }

  // Return the updated target object
  return target;
}

/**
 * Parses the input string to a number, boolean or returns the original string
 * From the local.settings.json (or static web app configuration)
 * @param {string} input
 * @returns {number|boolean|string}
 */
function parseValue(input) {
  if (!input) {
    return;
  }

  // Check for number
  if (!isNaN(input)) {
    return parseFloat(input);
  }
  // Check for boolean
  else if (input === "true" || input === "false") {
    return input === "true";
  }
  // Default back to string
  return input;
}

/**
 * Parse the key to match the desired output
 * @param {string} key Property name of the process.env object
 * @returns
 */
function parseKey(key) {
  if (!key) {
    return;
  }

  // Convert first character to lowercase to match javascript convention
  const newKey = key.charAt(0).toLowerCase() + key.slice(1);

  return newKey;
}

module.exports = {
  getValues,
};
