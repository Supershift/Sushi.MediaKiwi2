# useFilterInQuery

Makes sure that the filters, paging, and sorting of for example a table are rembered when a user goes into a detail page and then goes back to the page with the table.
Paging and Sorting parameters are optional.

Will fill the given filter+paging+sorting models from the query parameters in the route. This is done with a route.replace so it does not trigger a page reload.
After that, when the models are changed, it will update the query parameters.

Will also save the route information to pinia, so it can be used in certain 'back' scenarios. See [MkNavigationDrawerButton](./MkNavigationDrawerButton.md)

Nested scenarios are also supported, meaning "page with table" <-> "details page" <-> "detail page with table" <-> "detail details page"

## Basic Implementation

```tsx
<script setup lang="ts">
  import { TableFilter, Sorting, Paging, TableFilterType, SortDirection, TableFilterValue, useFilterInQuery } from "@supershift/mediakiwi-vue";

  const paging = ref<Paging>({ pageIndex: 0 });
  const sorting = ref<Sorting>({ sortBy: "id", sortDirection: SortDirection.Desc });
  const filters = ref<TableFilter>({
    name: {
      title: "Name",
      type: TableFilterType.TextField,
      searchable: true,
    },
    country: {
      title: "Land",
      options: [
        { title: "Nederland", value: "NL" },
        { title: "België", value: "BE" },
      ],
      type: TableFilterType.Select,
    }
  });

  useFilterInQuery(filters, paging, sorting);

</script>
```

## Custom conversions

The default url->filter action will match filter option values as strings and use that option that matches. If this fails, a new (temporary) option is created with the value from the url.

To overwrite this behavior, you can use `TableFilterItemQueryConverter`, in which you can specify the conversions.

```tsx
<script setup lang="ts">
  import { TableFilter, TableFilterType, SortDirection, TableFilterValue, useFilterInQuery, TableFilterItemQueryConverter } from "@supershift/mediakiwi-vue";

  const countries = [
    { title: "Nederland", value: "NL" },
    { title: "België", value: "BE" },
  ];

  const filters = ref<TableFilter>({
    name: {
      title: "Name",
      type: TableFilterType.TextField,
      searchable: true,
    },
    country: <TableFilterItemQueryConverter>{
      title: "Land",
      options: countries,
      type: TableFilterType.Select,

      toUrl: (objectValue: TableFilterValue) => objectValue.value.toLowerCase(),
      fromUrl: (urlValue: string | string[]) => countries.first(c => c.value == urlValue.toUpperCase())
    }
  });

  useFilterInQuery(filters);
</script>
```
