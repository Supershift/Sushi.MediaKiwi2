import { Ref, ref, watch } from "vue";
import { useMsal } from "./useMsal";

export function useIsAuthenticated(): Ref<boolean> {
  const { account } = useMsal();
  const isAuthenticated = ref(account.value !== null);

  watch(account, () => {
    isAuthenticated.value = account.value !== null;
  });

  return isAuthenticated;
}
