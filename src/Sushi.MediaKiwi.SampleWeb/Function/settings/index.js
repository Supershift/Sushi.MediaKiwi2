/* eslint-disable @typescript-eslint/explicit-function-return-type */
module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  // Add your appsettings here
  const mediaKiwi = {
    testVariable: process.env.MediaKiwi_TestVariable,
    useFakes: process.env.MediaKiwi_UseFakes === "true",
    useLocalApi: process.env.MediaKiwi_UseLocalApi === "true",
  };

  context.res = {
    status: 200,
    body: {
      mediaKiwi,
    },
  };
};
