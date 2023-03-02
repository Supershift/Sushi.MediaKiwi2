import { createPinia } from "pinia";
import router from "@/router/index";

const pinia = createPinia();
// add a property named `secret` to every store that is created
// after this plugin is installed this could be in a different file
pinia.use(({ store }) => {
    store.hello = "Welcome to Mediakiwi 2.0";
    store.router = router;
});
export default pinia;
