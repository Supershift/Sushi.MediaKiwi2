import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ConfigurationHttpTrigger } from "@supershift/mediakiwi-azure-function";

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => ConfigurationHttpTrigger(context, req, ["SampleApi"]);

export default httpTrigger;
