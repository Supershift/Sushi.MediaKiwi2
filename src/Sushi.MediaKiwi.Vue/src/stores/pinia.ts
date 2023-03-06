import { useRouter } from "@/router";
import { createPinia } from "pinia";

const pinia = createPinia();
// // add a property named `secret` to every store that is created
// // after this plugin is installed this could be in a different file
pinia.use(({ store }) => {
    store.hello = "Welcome to Mediakiwi 2.0 store";
    store.router = useRouter();
});
export default pinia;
