import { ConfigurationConnector } from "@/services/ConfigurationConnector";
import { AzureFunction, Context } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const connector = new ConfigurationConnector();

  // Default implementation
  const result = connector.Get();

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: result,
  };
};

export default httpTrigger;
