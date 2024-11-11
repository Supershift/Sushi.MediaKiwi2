import { createAxiosClient } from "@/services";
import { Api } from "./api";

const api = new Api<any>();
api.instance = createAxiosClient(import.meta.env.VITE_APP_SAMPLEAPI_APIBASEURL.replace('sample', ''));

export const sampleApi = api.sample;
