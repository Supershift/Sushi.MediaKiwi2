import { App, reactive } from "vue";
import { AccountInfo, EventMessage, EventMessageUtils, EventType, InteractionStatus, PublicClientApplication } from "@azure/msal-browser";
import { identity } from "@/identity";

export const msalPlugin = {
  install: (app: App, msalInstance: PublicClientApplication) => {
    const inProgress = InteractionStatus.Startup;
    const account = msalInstance.getActiveAccount();

    const state = reactive({
      instance: msalInstance,
      inProgress: inProgress,
      account: account,
    });

    app.config.globalProperties.$msal = state;
    identity.state = state;

    msalInstance.addEventCallback((message: EventMessage) => {
      switch (message.eventType) {
        case EventType.ACCOUNT_ADDED:
        case EventType.ACCOUNT_REMOVED:
        case EventType.LOGIN_SUCCESS:
        case EventType.SSO_SILENT_SUCCESS:
        case EventType.HANDLE_REDIRECT_END:
        case EventType.LOGIN_FAILURE:
        case EventType.SSO_SILENT_FAILURE:
        case EventType.LOGOUT_END:
        case EventType.ACQUIRE_TOKEN_SUCCESS:
        case EventType.ACQUIRE_TOKEN_FAILURE:
          const currentAccounts = msalInstance.getAllAccounts();
          // set active account
          if (currentAccounts.length) {
            msalInstance.setActiveAccount(currentAccounts[0]);
            state.account = currentAccounts[0];
          } else {
            // no account, set active account to 'null'
            msalInstance.setActiveAccount(null);
            state.account = null;
          }
          break;
      }

      const status = EventMessageUtils.getInteractionStatusFromEvent(message, state.inProgress);
      if (status !== null) {
        state.inProgress = status;
      }
    });
  },
};
