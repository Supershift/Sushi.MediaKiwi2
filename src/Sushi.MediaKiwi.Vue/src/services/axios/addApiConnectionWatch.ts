import { AxiosResponse } from "axios";
import { useApiConnection } from "@/composables/useApiConnection";

export async function addApiConnectionWatch(response: AxiosResponse<any, any>): Promise<AxiosResponse<any, any>> {
  const network = useApiConnection();
  network.setConnected(true);
  return response;
}
