## MediaKiwi 2.0

[Documentation](https://special-adventure-vyweypo.pages.github.io/)

## Nuget

![NuGet Version](https://img.shields.io/nuget/vpre/Sushi.MediaKiwi.DAL?label=Sushi.MediaKiwi.DAL&link=https%3A%2F%2Fwww.nuget.org%2Fpackages%2FSushi.MediaKiwi.DAL)
![NuGet Version](https://img.shields.io/nuget/vpre/Sushi.MediaKiwi.Services?label=Sushi.MediaKiwi.Services&link=https%3A%2F%2Fwww.nuget.org%2Fpackages%2FSushi.MediaKiwi.Services)
![NuGet Version](https://img.shields.io/nuget/vpre/Sushi.MediaKiwi.WebAPI?label=Sushi.MediaKiwi.WebAPI&link=https%3A%2F%2Fwww.nuget.org%2Fpackages%2FSushi.MediaKiwi.WebAPI)

## NPM

![NPM Version](https://img.shields.io/npm/v/%40supershift%2Fmediakiwi-vue?link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40supershift%2Fmediakiwi-vue&label=@supershift/mediakiwi-vue)
![NPM Version](https://img.shields.io/npm/v/%40supershift%2Fmediakiwi-azure-function?label=%40supershift%2Fmediakiwi-azure-function&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40supershift%2Fmediakiwi)

## Running the sample application

###

1. Run `npm run install:mediakiwi.vue` to install NPM dependencies
1. Import `SqlScripts/mediakiwi.bacpac` to your SQL Server to create the MediaKiwi database.
1. Ask a Supershift Entra Admin go give you the required user roles (User and Admin) in entra. Give them this link.
   https://portal.azure.com/#view/Microsoft_AAD_IAM/ManagedAppMenuBlade/~/Users/objectId/a7d9b2e0-1526-482d-ac95-0fdb6eef4bb4/appId/7cd2eddb-b79e-4e04-ac24-0011821ccb8e/preferredSingleSignOnMode~/null/servicePrincipalType/Application/fromNav/
1. Manage user secrets for the `Sushi.MediaKiwi.SampleAPI` project and set the following configuration:

```json
{
  "ConnectionStrings": {
    "portal": "Server=localhost;Initial Catalog=mediakiwi;Persist Security Info=False;Integrated Security=SSPI;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;"
  },
  "AddCORS": true
}
```

## Update api client for "Sushi.MediaKiwi.SampleAPI"

1. Build Sushi.MediaKiwi.SampleAPI C# project
1. Run `npm run api:update` for the Mediakiwi client
1. Run `npm run api:update:sample` for the sample client
