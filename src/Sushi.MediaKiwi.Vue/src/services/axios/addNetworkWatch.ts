import { AxiosResponse } from "axios";
import { useNetwork } from "@/composables/useNetwork";

export async function addConnectionWatch(response: AxiosResponse<any, any>): Promise<AxiosResponse<any, any>> {
  const network = useNetwork();
  network.setConnected(true);
  return response;
}
