# Global MediaKiwi FormOptions

To globally customize Form components, you can add props that would normally be set on the component on the global MediakiwiVueOptions.
This config applies to [MediaKiwiVueOptions](./../../Setup/MediakiwiVueOptions.md)

- General applies to all Form components
- Dialog to MkFormDialog components
- sideSheet to the MkFormSideSheet components
- view to the MkForm components

```typescript
// Provide Mediakiwi options
const mediakiwiOptions = <MediakiwiVueOptions>{
  [...]
  formOptions: {
    general: {
      validateOn: "input",
    },
    dialog: {
      closeOnSubmit: true,
      resetOnSubmit: true,
    },
    sideSheet: {
      resetOnSubmit: true,
      closeOnSubmit: true,
    },
    view: {
      hideToolbar: true,
    },
  },
};
```

For a full list of the options, see the [component props](./../../../src/Sushi.MediaKiwi.Vue/src/models/form/FormProps.ts)
