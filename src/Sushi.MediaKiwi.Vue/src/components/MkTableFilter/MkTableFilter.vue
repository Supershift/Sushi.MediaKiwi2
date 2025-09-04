<script setup lang="ts">
  import { shallowReactive, ref, watch, type Component, computed } from "vue";
  import type { TableFilter } from "@/models/table/TableFilter.js";
  import type { TableFilterItem } from "@/models/table/TableFilterItem.js";
  import type { TableFilterValue } from "@/models/table/TableFilterValue.js";
  import {
    MkTableFilterDateRangePicker,
    MkTableFilterRadioGroup,
    MkTableFilterSelect,
    MkTableFilterTextField,
    MkTableFilterSelectMultiple,
    MkTableFilterSelectMultipleCheckbox,
    MkTableFilterDatePicker,
    MkTableFilterOperator,
  } from ".";
  import type { DefineComponent } from "vue";
  import { defineAsyncComponent } from "vue";
  import { TableFilterType, IconsLibrary } from "@/models";
  import { useI18next } from "@/composables/useI18next";
  import { onKeyStroke } from "@vueuse/core";
  import MkTableFilterMenu from "./MkTableFilterMenu.vue";
  import MkTableFilterChips from "./MkTableFilterChips.vue";
  import { flattenFilter } from "@/helpers/filter/flattenFilter";
  import { useMediakiwiVueOptions } from "@/composables";

  // define properties and events
  const props = defineProps<{
    modelValue: TableFilter;
  }>();

  const emit = defineEmits<(e: "update:modelValue", value: TableFilter) => void>();

  // inject dependencies
  const { t, defaultT } = await useI18next("MkFilter");
  const mediakiwiVueOptions = useMediakiwiVueOptions();

  // define reactive variables
  const menu = ref(false);

  // check if we have a filter value
  const containsFilterValue = computed(() => {
    if (!props.modelValue) return false;

    const filterItems = flattenFilter(props.modelValue);

    return Object.values(filterItems)!.some((item) => !!item.selectedValue);
  });

  /** Get the searchable TableFilterItem */
  const searchableFilterKey = computed(() => {
    if (!props.modelValue) {
      return null;
    }

    // Get the first searchable filter item
    const key = Object.keys(props.modelValue).find((key) => props.modelValue[key].searchable);
    return key;
  });

  /** Get the searchable filter item based on the {@link searchableFilterKey} */
  const searchableFilterItem = computed<TableFilterItem | null>(() => {
    if (!searchableFilterKey.value) {
      return null;
    }

    // Get the corresponding filter item from the model value
    const result: TableFilterItem = props.modelValue[searchableFilterKey.value];
    return result;
  });

  /** Compute a bale with context menu to show while typing */
  const searchFilterItemLabel = computed(() => {
    return t.value("FilterSearchLabel", "{{filter.title}} with '{{filter.value}}''", {
      filter: {
        title: searchableFilterItem.value?.title,
        value: state.currentSearchText,
      },
    });
  });

  function isDirectApplyFilter(): boolean;
  function isDirectApplyFilter(filterItem: TableFilterItem): boolean;
  function isDirectApplyFilter(filterItem?: TableFilterItem): boolean {
    if (!filterItem) {
      filterItem = state.currentFilter;
    }

    return (
      filterItem?.type === TableFilterType.Direct ||
      (filterItem?.type === TableFilterType.SingleSelect && (!filterItem?.options?.length || filterItem?.options?.length <= 1))
    );
  }

  // holds the current filter being edited and its value
  const state = shallowReactive<{
    currentFilterKey?: string;
    currentFilter?: TableFilterItem;
    currentFilterValue?: TableFilterValue;
    currentSearchText?: string;
  }>({});

  /* Sets the provided filter as currently selected filter */
  function changeCurrentFilter(key: string, selectedFilter: TableFilterItem) {
    state.currentFilterKey = key;
    state.currentFilter = selectedFilter;
    state.currentFilterValue = undefined;
    state.currentSearchText = undefined;

    if (isDirectApplyFilter()) {
      directApplyFilter();
    }
  }

  function directApplyFilter() {
    const value = state.currentFilter?.options?.[0]?.value || true;
    const title = state.currentFilter?.options?.[0]?.title || "";
    state.currentFilterValue = { title, value };
    applyFilter();
  }

  /** Sets the current filter, current filter value and opens the menu */
  function setCurrentFilter(key: string, selectedFilter: TableFilterItem, showMenu = true) {
    if (isDirectApplyFilter(selectedFilter)) {
      return;
    }

    if (showMenu) {
      openMenu();
    }

    state.currentFilterKey = key;
    state.currentFilterValue = selectedFilter.selectedValue;
    state.currentFilter = selectedFilter;
  }

  function setSelectedValueRecursively(tableFilter: Record<string, TableFilterItem>, key: string, value: TableFilterValue | undefined) {
    for (const currentKey in tableFilter) {
      const filter = tableFilter[currentKey];
      if (currentKey === key) {
        // Set or unset selectedValue
        filter.selectedValue = value;
        return true; // Stop further searching once we've found it
      } else if (filter.children && typeof filter.children === "object") {
        if (setSelectedValueRecursively(filter.children, key, value)) {
          return true;
        }
      }
    }
    return false;
  }

  /* Reads the value currently set in the filter input and sets it on the filter as the selected value. */
  function applyFilter() {
    const copy: Record<string, TableFilterItem> = { ...props.modelValue };

    if (state.currentFilterKey) {
      setSelectedValueRecursively(copy, state.currentFilterKey, state.currentFilterValue);
    }

    // emit an event telling the selected filters have changed
    emit("update:modelValue", copy);

    closeFilter();
    closeMenu();
  }

  function applySearch() {
    // if we have a searchable filter item, set it as the current filter
    // Set value on the filter
    if (searchableFilterKey.value && searchableFilterItem.value) {
      // Set the current filter without opening the menu
      setCurrentFilter(searchableFilterKey.value, searchableFilterItem.value, false);
    }

    // Set the entered text as the current filter value
    if (state.currentFilter) {
      state.currentFilterValue = {
        title: state.currentSearchText || "",
        value: state.currentSearchText,
      };
    }

    // apply the filter
    applyFilter();

    // clear the search text
    state.currentSearchText = undefined;
  }

  /* Removed the filterItem id from the modelValue collection. */
  function removeFilter(key: string) {
    const copy: Record<string, TableFilterItem> = { ...props.modelValue };

    // delete the filter value if we had a value, but it is now undefined
    setSelectedValueRecursively(copy, key, undefined);

    // emit an event telling the selected filters have changed
    emit("update:modelValue", copy);
  }

  function closeMenu() {
    menu.value = false;
  }

  function openMenu() {
    menu.value = true;
  }

  function closeFilter() {
    // close the filter
    state.currentFilterKey = undefined;
    state.currentFilterValue = undefined;
    state.currentFilter = undefined;
    state.currentSearchText = undefined;
  }

  /**
   * Get the component for the filter type
   * @param item
   */
  function getComponentForFilterType(item: TableFilterItem): Component | DefineComponent {
    const optionsThreshold = 5;
    const filterType = item.type;
    const filterOptionsCount = item.options?.length || 0;

    // Determine the filter type and return the corresponding component
    if (filterType === TableFilterType.DatePicker) {
      return MkTableFilterDatePicker;
    } else if (filterType === TableFilterType.DateRange) {
      return MkTableFilterDateRangePicker;
    } else if (filterType === TableFilterType.TextField || filterType === TableFilterType.Contains) {
      return MkTableFilterTextField;
    } else if ((filterType === TableFilterType.SingleSelect && filterOptionsCount === 1) || filterType === TableFilterType.RadioGroup) {
      return MkTableFilterRadioGroup;
    } else if (filterType === TableFilterType.SingleSelect && filterOptionsCount <= optionsThreshold) {
      return MkTableFilterRadioGroup;
    } else if ((filterType === TableFilterType.SingleSelect && filterOptionsCount > optionsThreshold) || filterType === TableFilterType.Select) {
      return MkTableFilterSelect;
    } else if (
      (filterType === TableFilterType.MultiSelect && filterOptionsCount <= optionsThreshold) ||
      filterType === TableFilterType.SelectMultipleCheckbox
    ) {
      return MkTableFilterSelectMultipleCheckbox;
    } else if ((filterType === TableFilterType.MultiSelect && filterOptionsCount > optionsThreshold) || filterType === TableFilterType.SelectMultiple) {
      return MkTableFilterSelectMultiple;
    } else if (filterType === TableFilterType.Operator) {
      return MkTableFilterOperator;
    } else if (filterType === TableFilterType.Custom) {
      if (item.component) return defineAsyncComponent(item.component);
      else throw new Error(`No component found for filter type ${item.type}, add a component to the filter item.`);
    } else {
      throw new Error(`No component found for filter type ${item.type}`);
    }
  }

  const currentFilterComponent = computed(() => {
    if (state.currentFilter) {
      return getComponentForFilterType(state.currentFilter);
    }
    return null;
  });

  function getDisabledState(item: TableFilterItem): boolean {
    if (typeof item.disabled === "function") {
      return item.disabled(item);
    } else if (typeof item.disabled === "boolean") {
      return item.disabled;
    } else {
      return false;
    }
  }

  /**
   * Watch for the menu ref
   * Closes the filter when updated to false in any way (ie. click next to it)
   */
  watch(menu, () => {
    if (!menu.value) {
      closeFilter();
    }
  });

  /**
   * It allows MK2 to hijack the normal browser functions for searching
   * Opens the menu for filters
   * Default: true => When `filterOptions.shortKey` is `undefined` or `true` */
  if (mediakiwiVueOptions?.filterOptions?.shortKey !== false) {
    onKeyStroke("f", (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        openMenu();
      }
    });
  }
</script>

<template>
  <v-card class="mk-table-filter mb-4" rounded="lg" variant="flat" color="surface1">
    <div class="pa-4 mx-auto">
      <v-row class="d-flex flex-row flex-nowrap">
        <template v-if="modelValue">
          <v-menu v-model="menu" :close-on-content-click="false" location="bottom" class="mk-table-filter__menu-overlay">
            <!-- Filter Button -->
            <template #activator="args">
              <div class="px-1">
                <v-btn v-bind="args.props" color="on-surface1" variant="plain" :icon="IconsLibrary.filterVariant"> </v-btn>
              </div>
            </template>

            <!-- Context menu -->
            <MkTableFilterMenu
              v-if="!state.currentFilter"
              class="mk-table-filter__context-menu"
              :table-filter="modelValue"
              @get-disabled-state="getDisabledState"
              @change-current-filter="changeCurrentFilter"
            >
              <template #search>
                <template v-if="searchableFilterKey && state.currentSearchText">
                  <v-list-item :disabled="getDisabledState(modelValue[searchableFilterKey])" @click="applySearch">{{ searchFilterItemLabel }}</v-list-item>
                  <v-divider></v-divider>
                </template>
              </template>
            </MkTableFilterMenu>

            <!-- Filter compoment -->
            <template v-else-if="state.currentFilter">
              <component
                :is="currentFilterComponent"
                v-model="state.currentFilterValue"
                v-bind="state.currentFilter.componentProps"
                :table-filter-item="state.currentFilter"
                @click:close="closeMenu"
                @update:model-value="applyFilter"
              />
            </template>
          </v-menu>

          <div class="flex-1-1 d-flex flex-wrap ga-2 my-2">
            <!-- Chips -->
            <MkTableFilterChips v-if="containsFilterValue" :table-filter="modelValue" @change-current-filter="setCurrentFilter" @remove-filter="removeFilter" />

            <!-- Search box -->
            <v-text-field
              v-model="state.currentSearchText"
              :placeholder="!containsFilterValue ? defaultT('Filter') : ''"
              variant="plain"
              :hide-details="true"
              :readonly="!searchableFilterKey || getDisabledState(modelValue[searchableFilterKey])"
              density="compact"
              class="mk-table-filter__input pa-0"
              color="on-surface1"
              @click="openMenu"
              @focus="openMenu"
              @keypress.enter="applySearch"
            ></v-text-field>
          </div>
        </template>
      </v-row>
    </div>
  </v-card>
</template>
<style lang="scss" scoped>
  .mk-table-filter {
    height: 56px;
  }
</style>
