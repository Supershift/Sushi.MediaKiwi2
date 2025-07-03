import { createAxiosClient } from "@/services";
import { Api } from "./Api";
import { ref } from "vue";

const sampleApi = ref<Api<any>>();

export function useSampleApi() {
  if (!sampleApi.value) {
    const baseUrl = import.meta.env.VITE_APP_SAMPLEAPI_APIBASEURL;

    const api = new Api<any>();
    api.instance = createAxiosClient(baseUrl);
    sampleApi.value = api;
  }

  return sampleApi.value.sample;
}
