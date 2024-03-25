import { AccountInfo, InteractionStatus, PublicClientApplication } from "@azure/msal-browser";
import { computed, getCurrentInstance, Ref, toRefs } from "vue";

export type AccountInfoExtension = {
  /** Initial of the username */
  initital: string;
  /** Comma separated collection of roles */
  roles?: string;
};

export type MsalContext = {
  instance: PublicClientApplication;
  account: Ref<AccountInfo>;
  inProgress: Ref<InteractionStatus>;
  extendedAccountInfo: Ref<AccountInfoExtension>;
};

export function useMsal(): MsalContext {
  const internalInstance = getCurrentInstance();
  if (!internalInstance) {
    throw "useMsal() cannot be called outside the setup() function of a component";
  }
  const { instance, account, inProgress } = toRefs(internalInstance.appContext.config.globalProperties.$msal);

  if (!instance || !inProgress) {
    throw "Please install the msalPlugin";
  }

  if (inProgress.value === InteractionStatus.Startup) {
    instance.value.handleRedirectPromise().catch(() => {
      // Errors should be handled by listening to the LOGIN_FAILURE event
      return;
    });
  }

  const extendedAccountInfo = computed<AccountInfoExtension>(() => {
    const initital = account.value?.username.charAt(0).toUpperCase();
    const roles = account.value?.idTokenClaims?.roles?.join(", ");

    return {
      initital,
      roles,
    };
  });

  return {
    instance: instance.value,
    account,
    inProgress,
    extendedAccountInfo,
  };
}
