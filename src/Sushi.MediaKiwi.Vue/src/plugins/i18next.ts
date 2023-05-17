import { InitOptions, createInstance, type i18n } from "i18next";
import { App, ref, triggerRef } from "vue";

export default {
  install: (app: App, options?: InitOptions, callback?: (instance: i18n) => void) => {
    // create i18next
    const i18n = createInstance(options);

    // call callback if provided
    if (callback) callback(i18n);

    // init instance and make a ref to it
    i18n.init();
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
  },
};
