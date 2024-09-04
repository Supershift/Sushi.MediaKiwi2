import { computed, ref } from "vue";

const apiConnected = ref(true);

export function useApiConnection() {
  const isConnectedToApi = computed(() => apiConnected.value);

  function setConnected(value: boolean) {
    apiConnected.value = value;
  }

  return { isConnectedToApi, setConnected };
}
