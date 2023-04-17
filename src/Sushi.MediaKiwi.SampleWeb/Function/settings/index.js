/* eslint-disable @typescript-eslint/no-var-requires */
const { getValues } = require("./logic");

/* eslint-disable @typescript-eslint/explicit-function-return-type */
module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  // Get Values from process.env with the MediaKiwi prefix
  const mediaKiwi = getValues("MediaKiwi", process.env);

  context.res = {
    status: 200,
    body: { ...mediaKiwi },
  };
};
