# Front-End Development Setup

### Introduction

There are two front-end projects that you'll need to get up and running.

- Sushi.MediaKiwi.Vue
- Sushi.MediaKiwi.SampleWeb

#### Stack & Tools

- [Node v18.13.0](https://nodejs.org/en)
- [Npm v8.19.3](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Azure Core Functions Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Cwindows%2Ccsharp%2Cportal%2Cbash)
- [VS Code](https://code.visualstudio.com/)
- [Volar (VS Code Extension)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [TypeScript Vue Plugin (VS Code Extension)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [Prettier (VS Code Extension)](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESList (VS Code Extension)](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

##### Useful tools

- [Npm Intellisense (VS Code Extension)](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)
- [Document This (VS Code Extension)](https://marketplace.visualstudio.com/items?itemName=oouo-diogo-perdigao.docthis)

## Setup the Sushi.Mediakiwi.Vue library

### Install the dependencies:

Install the dependencies for all projects by running the install command from the root of the repository. The postinstall script will install the node_modules on the sub projects.

```shell
npm install
```

### Build the library

Build the Sushi.MediaKiwi.Vue library once or keep a watch going. This will create the `/dist` folder.

```shell
# Sushi.MediaKiwi.Vue
npm run build

# or

# Sushi.MediaKiwi.Vue
npm run build:watch
```

### Link your local build

Use the npm link command in the `Sushi.MediaKiwi.Vue` folder to use your local codebase of Sushi.MediaKiwi.

```shell
# Sushi.MediaKiwi.Vue
npm link @supershift/mediakiwi-vue
```

Check if the link was made successful by running the following command.

```shell
# Sushi.MediaKiwi.Vue
npm ls -g --link=true

# Output: @supershift/mediakiwi-vue@0.0.x -> [local_path]\Sushi.MediaKiwi2\src\Sushi.MediaKiwi.Vue
```

## Setup the Sushi.Mediakiwi.SampleWeb

The Sushi.Mediakiwi.SampleWeb is an Azure Static Web App and therefore has a Client App and Azure Function.

### Azure Function

Add a `local.settings.json` file in the root of the Function folder. Here you can add application settings to use in the Client App. This file is excluded from source control.

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

You can now start hosting the Azure Function. See the [Client App](#client-app) section to host both the Azure Function and the Client App.

To just host the Azure function, use the following command.

```shell
# Sushi.MediaKiwi.SampleWeb/Function
func start --javascript
```

### Client App

Run both the Azure Function and the Client App using the following command.

```shell
# Sushi.MediaKiwi.SampleWeb/ClientApp.
npm run start:web
```

## Read more

- [Mediakiwi on Confluence](https://supershift.atlassian.net/wiki/spaces/MK/pages/1226801153/MediaKiwi+2.0+Overview)
- [Mediakiwi Front-End on Confluence](https://supershift.atlassian.net/wiki/spaces/MK/pages/1232699399/Front-end+application)
