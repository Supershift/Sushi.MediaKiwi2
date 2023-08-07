<script setup lang="ts">
  import { shallowReactive, ref, watch, type Component } from "vue";
  import { TableFilter } from "@/models/table/TableFilter.js";
  import { TableFilterItem } from "@/models/table/TableFilterItem.js";
  import { TableFilterValue } from "@/models/table/TableFilterValue.js";
  import { MkTableFilterDatePicker, MkTableFilterRadioGroup, MkTableFilterSelect, MkTableFilterTextField } from ".";
  import { DefineComponent } from "vue";
  import { TableFilterType } from "@/models/enum/TableFilterType";
  import { MkInputChip } from "@/components/MkChip";
  import { defineAsyncComponent } from "vue";
  import { useI18next } from "@/composables/useI18next";
  import { MkDialogCard } from "@/components/MkDialog";

  // define properties and events
  const props = defineProps<{
    modelValue: TableFilter;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilter): void;
  }>();

  // inject dependencies
  const { defaultT } = await useI18next();

  // define reactive variables
  const menu = ref(false);

  // holds the current filter being edited and its value
  interface IState {
    currentFilterKey?: string;
    currentFilter?: TableFilterItem;
    currentFilterValue?: TableFilterValue;
  }

  const state = shallowReactive<IState>({});

  /* Sets the provided filter as currently selected filter */
  function changeCurrentFilter(key: string, selectedFilter: TableFilterItem) {
    state.currentFilterKey = key;
    state.currentFilter = selectedFilter;
    state.currentFilterValue = undefined;
  }

  /** Sets the current filter, current filter value and opens the menu */
  function setCurrentFilter(key: string, selectedFilter: TableFilterItem) {
    openMenu();
    state.currentFilterKey = key;
    state.currentFilterValue = selectedFilter.selectedValue;
    state.currentFilter = selectedFilter;
  }

  /* Reads the value currently set in the filter input and sets it on the filter as the selected value. */
  function applyFilter() {
    // get value and set it to selected filter values
    if (state.currentFilter !== undefined) {
      if (state.currentFilterValue !== undefined) {
        props.modelValue[state.currentFilterKey!].selectedValue = state.currentFilterValue;
      } else if (props.modelValue[state.currentFilterKey!]) {
        // delete the filter value if we had a value, but it is now undefined
        props.modelValue[state.currentFilterKey!].selectedValue = undefined;
      }
    }
    // emit an event telling the selected filters have changed
    emit("update:modelValue", props.modelValue);

    closeFilter();
    closeMenu();
  }

  /* Removed the filterItem id from the modelValue collection. */
  function removeFilter(key: string) {
    // delete the filter value if we had a value, but it is now undefined
    props.modelValue[key].selectedValue = undefined;

    // emit an event telling the selected filters have changed
    emit("update:modelValue", props.modelValue);
  }

  function closeMenu() {
    menu.value = false;
  }

  function openMenu() {
    menu.value = true;
  }

  function closeFilter() {
    // close the filter
    state.currentFilterValue = undefined;
    state.currentFilter = undefined;
  }

  function GetComponentForFilterType(item: TableFilterItem): Component | DefineComponent {
    switch (item.type) {
      case TableFilterType.DatePicker:
        return MkTableFilterDatePicker;
      case TableFilterType.RadioGroup:
        return MkTableFilterRadioGroup;
      case TableFilterType.Select:
        return MkTableFilterSelect;
      case TableFilterType.TextField:
        return MkTableFilterTextField;
      case TableFilterType.Custom:
        if (item.component) return defineAsyncComponent(item.component);
        else throw new Error(`No component found for filter type ${item.type}, add a component to the filter item.`);
      default:
        throw new Error(`No component found for filter type ${item.type}`);
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
</script>

<template>
  <v-divider />
  <v-card class="mk-table-filter" variant="flat" rounded="0">
    <v-container>
      <v-row class="pb-2">
        <template v-if="modelValue">
          <v-menu v-model="menu" :close-on-content-click="false" location="end">
            <!-- Button -->
            <template #activator="args">
              <v-btn class="mt-1 ml-1" v-bind="args.props" color="primary" variant="plain" icon="mdi-filter-variant"> </v-btn>
            </template>

            <!-- context menu -->
            <v-list v-if="!state.currentFilter">
              <v-list-item v-for="key in Object.keys(modelValue)" :key="key" :value="modelValue[key]" @click="changeCurrentFilter(key, modelValue[key])">
                <v-list-item-title>{{ modelValue[key].title }}</v-list-item-title>
              </v-list-item>
            </v-list>

            <!-- filter compoment -->
            <MkDialogCard v-else-if="state.currentFilter" :title="state.currentFilter.title" @click:close="closeMenu">
              <template #intro>
                <p>Plase enter the correct item</p>
              </template>
              <component :is="GetComponentForFilterType(state.currentFilter)" v-model="state.currentFilterValue" :table-filter-item="state.currentFilter" />
              <template #actions>
                <v-btn @click="applyFilter()">{{ defaultT("Apply") }}</v-btn>
              </template>
            </MkDialogCard>
          </v-menu>

          <!-- Chips -->
          <template v-for="key in Object.keys(modelValue)">
            <MkInputChip
              v-if="modelValue[key].selectedValue"
              :key="key"
              class="ml-2 mt-2"
              @click="setCurrentFilter(key, modelValue[key])"
              @click:remove="removeFilter(key)"
            >
              {{ modelValue[key].title }} : {{ modelValue[key].selectedValue?.title }}
            </MkInputChip>
          </template>

          <v-text-field
            :placeholder="defaultT('Filter')"
            variant="plain"
            :hide-details="true"
            readonly
            density="compact"
            class="mk-table-filter__input mx-2"
            @click="openMenu"
          ></v-text-field>
        </template>
      </v-row>
    </v-container>
  </v-card>
  <v-divider />
</template>

<stlye lang="scss" scoped>
.v-card--variant-flat {
  &.mk-table-filter {
    background: none;
    color: rgb(var(--v-theme-on-surface-variant));
  }
}

.v-input .v-field__input {
  --v-field-padding-top: 4px;
}

.v-btn--icon.v-btn--density-default {
  --v-btn-height: 28px;
}

.v-row {
  padding-bottom: 6px;
}
</stlye>
