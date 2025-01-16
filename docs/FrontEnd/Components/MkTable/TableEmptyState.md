# Table empty state

MkTable empty state will use the global emptyState option from the MediakiwiVueOptions.
Their are 2 variant, default and filter. The filter variant will only be shown when the users uses the filters and the table yields no results.

Customization per table:

```tsx
<template>
  <mk-table
    empty-state-headline="Whoops"
    empty-state-title="No items found"
    empty-state-text="Please add a new item"
    empty-state-image="@/assets/empty-state.svg"
  ></mk-table>
</template>
```

Global customization. all properties accept `false` in order to hide it. A default is used when no options are provided.

```ts
const mediakiwiOptions: MediakiwiVueOptions = {
  [...]
  emptyState: {
    filter: {
      image: emptyStateFilterSvg,
      headline: false,
      title: "Oops! No results found matching your criteria.",
      text: "Try changing your filter criteria to get more results.",
    },
    default: {
      image: emptyStateSvg,
      headline: false,
      title: "Oops! No results found matching your criteria.",
      text: "Try changing your filter criteria to get more results.",
    }
  },
};
```
