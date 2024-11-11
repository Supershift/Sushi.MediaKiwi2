<script setup lang="ts" generic="T">
  import { useTableSorting } from "@/composables/useTableSorting";
  import { Sorting, TableMapItem, TableSortingOptions } from "@/models";
  import { computed } from "vue";

  const props = defineProps<{
    /** Use Sorting<T> for typesafety*/
    sorting?: Sorting<T> | Sorting;
    mapItem?: TableMapItem<any>;
    /** @deprecated Use sortingKey for a more typesafe solution */
    sortingOptions?: TableSortingOptions<T>;
    sortingKey?: keyof T;
    truncate?: boolean;
    /** optional width of the column */
    width?: string;
    /** optional id used for the display options */
    mkColumnId?: string;
  }>();

  // define event
  const emit = defineEmits<{
    (e: "update:sorting", value?: Sorting): void;
  }>();

  // define slots
  defineSlots<{
    /** Slot designed for the buttons (or whatever the user wants) that are available behind the 3 dots menu */
    default: (props: unknown) => void;
  }>();

  const sortingOptions = computed(() => {
    return props.mapItem ? props.mapItem.sortingOptions : props.sortingKey ? <TableSortingOptions<T>>{ id: props.sortingKey } : props.sortingOptions;
  });

  /** Init sorting composable */
  const { setSorting, getSortingClasses, selectedSorting, sortIcon } = useTableSorting({
    selectedSortOption: props.sorting,
  });

  function onClick() {
    if (sortingOptions.value) {
      setSorting(sortingOptions.value);
      emit("update:sorting", selectedSorting.value);
    }
  }

  const headerClasses = computed<Record<string, boolean>>(() => {
    const sortingClasses = sortingOptions.value ? getSortingClasses(sortingOptions.value) : {};
    return {
      ...sortingClasses,
    };
  });

  const sortingClasses = computed<Record<string, boolean>>(() => {
    return {
      hidden: !selectedSorting.value,
    };
  });
</script>

<template>
  <th :class="headerClasses" @click="onClick" :width="width" :mk-column-id="mkColumnId">
    <label class="mk-table-view__head" :class="{ truncate }">
      <label>
        <template v-if="mapItem?.headerTitle"> {{ mapItem?.headerTitle }}</template>
        <template v-else><slot></slot></template>
      </label>
      <v-icon v-if="sortingOptions" class="sort-icon" :class="sortingClasses" :icon="sortIcon" />
    </label>
  </th>
</template>

<style scoped lang="scss">
  th {
    .mk-table-view__head.truncate {
      display: flex;
      flex-direction: row;
      white-space: nowrap;
      overflow: hidden;
      contain: inline-size;

      label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .v-icon {
        flex: 0 0 auto;
      }
    }

    // Sorting icon logic
    &.sortable {
      font-weight: 700 !important;

      .v-icon {
        visibility: hidden;
      }

      &:hover {
        cursor: pointer;
        .v-icon {
          visibility: visible;
        }
      }

      &.sortable-active {
        .sort-icon {
          visibility: visible;
        }
      }

      .v-icon {
        visibility: hidden;
      }
    }
  }
</style>
