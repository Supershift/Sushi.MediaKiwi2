# Context menu

You can add a context menu to the MkTable using the slot.

```tsx
<template>
  <mk-table>
    [...]
    <template #contextmenu="{ dataItem }">
    <v-list>
      <v-list-item @click="() => console.log('context click')"> Knop A: {{ dataItem.name! }}</v-list-item>
      <v-list-item @click="() => console.log('ccontext click')"> Knop B: {{ dataItem.name! }}</v-list-item>
    </v-list>
    </template>
  </mk-table>
</template>
```

## Table row actions button

This automatically adds an extra table cell at the end of the table with a kebab menu, allowing the user to access the menu in a different way. To disable this, you can use the `hide-table-row-actions` props on the MkTable component. This keeps the context menu available.
