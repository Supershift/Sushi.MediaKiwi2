import { InternalAxiosRequestConfig } from "axios";
import { identity } from "@/identity";

export async function addAuthentication(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  // add authorization header by acquiring token
  const accessToken = await identity.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `bearer ${accessToken}`;
  } else {
    console.warn("no active account found");
  }
  return config;
}
