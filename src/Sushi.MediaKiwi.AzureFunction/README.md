# Sushi.MediaKiwi.AzureFunction

### Introduction

This package will help getter configuration running through an Azure Function HttpTrigger for your Static Web App

## Setup

### Install the package:

```shell
npm i @supershift/mediakiwi-azure-function
```

### Usage

Create an Node Azure Function of your own liking and import the ConfigurationHttpTrigger from the package

```typescript
import { ConfigurationHttpTrigger } from "@supershift/mediakiwi-azure-function";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  ConfigurationHttpTrigger(context, req);
};

export default httpTrigger;
```

### [Optional]

Add additional section by providing them as a third parameter

```typescript
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  ConfigurationHttpTrigger(context, req, ["SampleApi"]);
};
```
