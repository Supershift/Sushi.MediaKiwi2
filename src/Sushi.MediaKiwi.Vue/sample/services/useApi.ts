import { createAxiosClient } from "@/services";
import { Api } from "./api";
import { ref } from 'vue'

const sampleApi = ref<Api<any>>();

export function useSampleApi() {

  if (!sampleApi.value) {
    const baseUrl = import.meta.env.VITE_APP_SAMPLEAPI_APIBASEURL;

    // Stripping the baseUrl so that it is backwards compatible 
    // with the .env files and the environment variables on the live environments
    const baseUrlStripped = baseUrl?.replace('sample', '') ?? '';

    const api = new Api<any>();
    api.instance = createAxiosClient(baseUrlStripped);
    sampleApi.value = api;
  }

  return sampleApi.value.sample;
}
