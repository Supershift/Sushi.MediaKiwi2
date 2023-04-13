/**
 * Creates a new filtered Object with values from the process.env with the provided prefix.
 * process.env is an object build from a Dictionay<string, string>
 * @param {string} prefix
 * @returns {object} Object of filtered values
 */
function getValues(prefix) {
  // Filter and build new object based on process.env
  const values = Object.keys(process.env)
    .filter((key) => key.includes(prefix))
    .reduce((cur, key) => {
      return Object.assign(cur, { [parseKey(key, prefix)]: parseValue(process.env[key]) });
    }, {});

  return values;
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
 * @param {string} prefix
 * @returns
 */
function parseKey(key, prefix) {
  if (!key) {
    return;
  }

  let newKey = key;

  // Remove the prefix from the key
  newKey = newKey.replace(prefix, "");

  // Convert first character to lowercase to match javascript convention
  if (newKey) {
    newKey = newKey.charAt(0).toLowerCase() + newKey.slice(1);
  }

  return newKey;
}

module.exports = {
  getValues,
  parseValue,
  parseKey,
};
