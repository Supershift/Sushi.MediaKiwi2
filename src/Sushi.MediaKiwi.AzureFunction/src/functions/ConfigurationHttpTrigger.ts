import { ConfigurationConnector } from "@/services/ConfigurationConnector";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

export const ConfigurationHttpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, sections?: string[]): Promise<void> {
  context.log("HTTP trigger function processed a request.", req);

  const connector = new ConfigurationConnector();

  // Default implementation
  const result = connector.Get(sections);

  context.res = {
    status: 200,
    body: result,
  };
};
