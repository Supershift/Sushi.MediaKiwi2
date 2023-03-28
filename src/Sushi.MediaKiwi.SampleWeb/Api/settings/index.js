/* eslint-disable @typescript-eslint/explicit-function-return-type */

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  const MEDIAKIWI_TESTVARIABLE = process.env.MEDIAKIWI_TESTVARIABLE;

  console.log("MEDIAKIWI_TESTVARIABLE::::::" + MEDIAKIWI_TESTVARIABLE);

  context.res = {
    status: 200,
    body: { MEDIAKIWI_TESTVARIABLE },
  };
};
