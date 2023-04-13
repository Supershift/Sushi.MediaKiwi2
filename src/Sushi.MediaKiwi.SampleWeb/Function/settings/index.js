/* eslint-disable @typescript-eslint/no-var-requires */
const { getValues } = require("./logic");

/* eslint-disable @typescript-eslint/explicit-function-return-type */
module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  // Get Values from process.env with the prefix
  const prefix = "MediaKiwi:";
  const mediaKiwi = getValues(prefix);

  context.res = {
    status: 200,
    body: {
      mediaKiwi,
    },
  };
};
