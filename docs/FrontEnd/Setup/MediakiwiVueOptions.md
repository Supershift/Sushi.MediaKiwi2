# Mediakiwi Vue Options

Install the MediaKiwi plugin with MediaKiwiVueOptions to setup global customizations, formatting options and authentication

```typescript
import { useEntraSettings } from "@/composables/useEntraSettings";

const mediakiwiOptions = <MediakiwiVueOptions>{
  vuetifyOptions: ...,
  apiBaseUrl: import.meta.env.VITE_APP_MEDIAKIWI_APIBASEURL,
  msalConfig: <Configuration>{},
  identity: <MediakiwiIdentity>{},
  modules: ...,
  dateFormatOptions: ...,
  signIn: ...,
};

const { fillEntraSettings } = useEntraSettings();
const mediakiwiOptionsWithEntra = await fillEntraSettings(mediakiwiOptions);

// Create the app
const app = createApp(App);

// install mediakiwi
app.use(mediakiwi, mediakiwiOptionsWithEntra);
```

For more options [click here](./../../../src/Sushi.MediaKiwi.Vue/src/models/options/MediakiwiVueOptions.ts)
