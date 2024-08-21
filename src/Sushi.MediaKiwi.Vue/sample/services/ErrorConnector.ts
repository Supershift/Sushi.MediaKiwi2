import { injectable, inject } from "tsyringe";
import type { AxiosInstance, AxiosResponse } from "axios";

@injectable()
export class ErrorConnector {
  constructor(@inject("SampleApiAxiosInstance") private axios: AxiosInstance) {}

  async getGenericError(): Promise<AxiosResponse> {
    const response = await this.axios.get("/Error/genericError");
    return response;
  }

  async getAggregateError(): Promise<AxiosResponse> {
    const response = await this.axios.get("/Error/aggregateError");
    return response;
  }
}
