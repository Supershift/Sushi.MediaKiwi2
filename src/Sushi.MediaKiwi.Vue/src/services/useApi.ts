import { createAxiosClient } from "@/services";
import { Api } from "./Api";
import { inject, ref } from 'vue'
import { MediakiwiVueOptions } from "@/models";

const mediakiwiApi = ref<Api<any>>();

export function useMediaKiwiApi() {

  if (!mediakiwiApi.value) {
    const baseUrl = inject<MediakiwiVueOptions>('mediakiwi')?.apiBaseUrl;

    // Stripping the baseUrl so that it is backwards compatible 
    // with the .env files and the environment variables on the live environments
    const baseUrlStripped = baseUrl?.replace('mediakiwi/api', '') ?? '';

    const api = new Api<any>();
    api.instance = createAxiosClient(baseUrlStripped);
    mediakiwiApi.value = api;
  }

  return mediakiwiApi.value.mediakiwi;
}
