import { createAxiosClient } from "@/services";
import { Api } from "./api";
import { inject, ref } from 'vue'
import { MediakiwiVueOptions } from "@/models";

const mediakiwiApi = ref<Api<any>>();

export function useMediaKiwiApi() {

  if (!mediakiwiApi.value) {
    const api = new Api<any>();
    api.instance = createAxiosClient(inject<MediakiwiVueOptions>('mediakiwi')?.apiBaseUrl.replace('mediakiwi/api', '') ?? '');
    mediakiwiApi.value = api;
  }

  return mediakiwiApi.value.mediakiwi;
}
