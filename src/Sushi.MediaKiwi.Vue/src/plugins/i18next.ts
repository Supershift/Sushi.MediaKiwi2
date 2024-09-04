import { InitOptions, createInstance, i18n } from "i18next";
import { App, ref, triggerRef } from "vue";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { MediakiwiVueOptions } from "@/models";
import { container } from "tsyringe";
import axios from "axios";
import { useApiConnection } from "@/composables/useApiConnection";
import { globalErrorHandler } from "@/errorHandler/globalErrorHandler";

const { isConnectedToApi } = useApiConnection();

export const tokenStore = <
  {
    token: string | undefined;
  }
>{};

export default {
  install: (app: App, mediakiwiOptions: MediakiwiVueOptions, options?: InitOptions, callback?: (instance: i18n) => void) => {
    // create i18next
    const i18n = createInstance(options);

    // add language detector
    i18n.use(LanguageDetector);

    // add http backend
    const httpApi = new HttpApi();

    httpApi.init(null, {
      crossDomain: true,
      loadPath: `${mediakiwiOptions.apiBaseUrl}/translations/{{lng}}/{{ns}}`,
      addPath: `${mediakiwiOptions.apiBaseUrl}/translations/{{lng}}/{{ns}}`,
      customHeaders: () => {
        let result = {};
        // custom headers does not support promises
        // the below is a temp fix, we will need an http backend which does support promises or ideally axios
        const accessToken = tokenStore.token;

        if (accessToken) {
          result = { Authorization: `Bearer ${accessToken}` };
        }
        return result;
      },

      request: async (options, url, payload, callback) => {
        const headers = options && options.customHeaders && typeof options.customHeaders === "function" ? options.customHeaders() : {};
        let response: any = {};

        if (!isConnectedToApi.value) {
          // if we are not connected, we should not retry any more
          i18n.options.maxRetries = 0;
        } else {
          try {
            if (payload) {
              response = await axios.post(url, payload, { headers });
            } else {
              response = await axios.get(url, { headers });
            }
          } catch (error) {
            globalErrorHandler(error);
            callback(error, { data: {}, status: 500 });
            return;
          }
        }

        // call the callback with our response
        callback(null, response);
      },
    });

    i18n.use(httpApi);

    // call callback if provided
    if (callback) callback(i18n);

    // init instance and make a ref to it
    const i18initPromise = i18n.init();
    const instance = ref(i18n);

    // subscribe to events, so we can manually trigger a ref update
    const rerenderOn = ["languageChanged", "loaded"];
    rerenderOn.forEach((event) => {
      i18n.on(event, () => {
        // trigger a ref update
        triggerRef(instance);
      });
    });

    // add i18next to the app
    app.provide("i18next", instance);
    app.provide("i18initPromise", i18initPromise);

    // register i18next with tsyringe
    container.registerInstance("i18next", instance);
    container.registerInstance("i18initPromise", i18initPromise);
  },
};
