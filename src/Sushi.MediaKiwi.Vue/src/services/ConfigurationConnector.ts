import { Configuration } from "@/models";
import axios from "axios";

export class ConfigurationConnector {
  baseUrl: string;
  path: string;

  constructor(path: string, baseUrl?: string) {
    this.path = path;
    this.baseUrl = baseUrl || "";
  }

  async GetAsync<T = Configuration>(): Promise<T> {
    const response = await axios.get<T>(`${this.baseUrl}${this.path}`);
    return await response.data;
  }
}
