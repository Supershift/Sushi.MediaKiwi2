# Error handling and feedback

#### Vue error handler

Upon installing the mediakiwi plugin a global errorHandler is installed on the [app.config.errorHandler](https://vuejs.org/api/application.html#app-config-errorhandler). This handler parses the error an [ErrorProblemDetails](./../../../src/Sushi.MediaKiwi.Vue/src/models/errors//ErrorProblemDetails.ts).

#### Axios interceptor

All axios clients created through the [createAxiosClient](./../../../src/Sushi.MediaKiwi.Vue/src/services/axios/createAxiosClient.ts) service receive a response interceptor that parsess an [ErrorProblemDetails](./../../../src/Sushi.MediaKiwi.Vue/src/models/errors//ErrorProblemDetails.ts) object.

## Feedback

Caught errors are shown within a [v-alert](https://vuetifyjs.com/en/components/alerts/#usage) on the form when is was thrown on a component with a MkForm, MkFormDialog or MkFormSideSheet parent.

When it was thown outside a form component, a [snackbar](https://vuetifyjs.com/en/components/snackbars/#usage) is shown.
