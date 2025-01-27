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

  async getInternalServerError(): Promise<AxiosResponse> {
    const response = await this.axios.get(`/Error/internalServerError`);
    return response;
  }

  async getTimeoutError(): Promise<AxiosResponse> {
    const response = await this.axios.get(`/Error/timeoutError`, { timeout: 1 });
    return response;
  }

  async getStringError(): Promise<AxiosResponse> {
    const response = await this.axios.get(`/Error/stringError`);
    return response;
  }
}
