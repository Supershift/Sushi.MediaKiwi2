# Table row selection

Enable the row selection by adding the modelRef to the component.

```tsx
<script>
  const selectedItems = T[]
</script>

<template>
  <mk-table
    v-model:selection="selectedItems">
  </mk-table>
</template>
```

This enables the selection via keyboard shortcuts (ctrl/cmd and shift) and adds a table column at position zero with a checkbox.

## Keyboard shortcuts only

To only have the keyboard shortcuts to select items, you can add an extra prop to the MkTable `hide-selection-checkbox`. This removes the checkbox column at position zero, but still allows the keyboard shortcuts.
