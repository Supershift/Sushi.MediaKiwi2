import "pinia";
import type { Router } from "vue-router";
import type { MediaKiwiState } from "../../stores/index";

declare module "pinia" {
  export interface PiniaCustomProperties {
    // // by using a setter we can allow both strings and refs
    // set hello(value: string | Ref<string>);
    // get hello(): string;

    // type the router added by the plugin above (#adding-new-external-properties)
    router: Router;
    mediakiwi: MediaKiwiState;
  }
}
