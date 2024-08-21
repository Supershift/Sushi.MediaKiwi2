# Static Web

To use MediaKiwi with an Azure Static Web App you can the following. Asuming you have a ClientApp and Function folder.

### Azure Function

Add a `local.settings.json` file in the root of the Function folder. Here you can add application settings to use in the Client App. This file is excluded from source control.
The required MSAL properties can be automaticaly filled when the service uses Mediakiwi >0.1.7 (TODO: add actual version when released).
The `config = fillEntraSettings(config)` will get the required values from the service and will update the config. The `local.settings.json` will be used as backup.

Example:

```json
{
  "Values": {
    "MediaKiwi.ApiBaseUrl": "[your_url]",
    "MediaKiwi.msalConfig.auth.clientId": "[your_key]",
    "MediaKiwi.msalConfig.auth.redirectUri": "/loginRedirect",
    "MediaKiwi.msalConfig.auth.postLogoutRedirectUri": "/signIn",
    "SampleApi.ApiBaseUrl": "[your_url]"
  }
}
```

### Client App

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

You can now start hosting the Azure Function. See the [Client App](#client-app) section to host both the Azure Function and the Client App.

To just host the Azure function, use the following command.

```shell
# Sushi.MediaKiwi.SampleWeb/Function
func start --javascript
```

### Finally

Run both the Azure Function and the Client App using the following command.

```shell
# Sushi.MediaKiwi.SampleWeb/ClientApp.
npm run start:web
```
