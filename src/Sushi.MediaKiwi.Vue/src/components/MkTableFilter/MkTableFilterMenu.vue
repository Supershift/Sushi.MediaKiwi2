<script setup lang="ts">
  import { TableFilter, TableFilterItem } from "@/models";

  // holds the current filter being edited and its value
  const props = defineProps<{
    tableFilter: TableFilter;
    onGetDisabledState: (value: TableFilterItem) => boolean;
    onChangeCurrentFilter: (key: string, selectedFilter: TableFilterItem) => void;
  }>();

  const slots = defineSlots<{
    search: () => void;
  }>();

  /**
   * Creates the events for the filter item.
   * @param key - The key of the selected filter item.
   * @param selectedFilter - The selected filter item.
   */
  function getEvents(key: string, selectedFilter: TableFilterItem) {
    const events: Record<string, () => void> = {};

    // Only add the click event if the filter has a type defined
    if (selectedFilter.type) {
      events["onClick"] = () => props.onChangeCurrentFilter(key, selectedFilter);
    }

    return events;
  }
</script>

<template>
  <v-list>
    <slot name="search" v-if="slots.search"></slot>
    <template v-for="key in Object.keys(tableFilter)" :key="key">
      <v-list-item :value="tableFilter[key]" v-bind="getEvents(key, tableFilter[key])" :disabled="onGetDisabledState(tableFilter[key])">
        <v-list-item-title>{{ tableFilter[key].title }}</v-list-item-title>

        <template #append v-if="tableFilter[key].children">
          <v-icon icon="$menuRight" size="x-small"></v-icon>
        </template>
        <v-menu v-if="tableFilter[key].children" :open-on-focus="false" open-on-hover activator="parent" submenu :close-on-content-click="false">
          <MkTableFilterMenu
            :table-filter="tableFilter[key].children"
            @get-disabled-state="onGetDisabledState"
            @change-current-filter="onChangeCurrentFilter"
          />
        </v-menu>
      </v-list-item>

      <v-divider v-if="tableFilter[key].divider" />
    </template>
  </v-list>
</template>
