# Forms

There are multiple Form component variants.

## Components

- [MkForm](./MkForm.md)
- [MkFormDialog](./MkFormDialog.md)
- [MkFormSideSheet](./MkFormSideSheet.md)

## Error handling and feedback

By default all errors within the Form are handled by the global error handler.
Errors thrown within the context of the Form are rendered as a v-alert component atop the form. [Read more](./../Feedback/ErrorHandling.md).

All feedback is given using the default labels. [Read more](./../Feedback/FormMessages.md).

## Customization

There are multiple ways of customizing the MkForms. You can define the props on the component or define them globally in the [MediaKiwiFormOptions](./MediaKiwiFormOptions.md)

## Event handlers

- `@load` Is invoked when the Form is loaded
- `@submit` Is invoked when the default form submit button is clicked
- `@delete` is invoked when the default form delete button is clicked

## Models

The Forms expect these options modelValues

- `inProgress` allows you to act on or set the progress state of the form. This is set on all event handlers
- `isValid` allows you to act the validd state of the form.
- `error` allow you to set the error on the form yourself
