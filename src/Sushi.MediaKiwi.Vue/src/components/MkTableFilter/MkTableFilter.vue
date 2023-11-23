<script setup lang="ts">
  import { shallowReactive, ref, watch, type Component, computed } from "vue";
  import { TableFilter } from "@/models/table/TableFilter.js";
  import { TableFilterItem } from "@/models/table/TableFilterItem.js";
  import { TableFilterValue } from "@/models/table/TableFilterValue.js";
  import { MkTableFilterDatePicker, MkTableFilterRadioGroup, MkTableFilterSelect, MkTableFilterTextField } from ".";
  import { DefineComponent } from "vue";
  import { TableFilterType, IconsLibrary } from "@/models";
  import { MkInputChip } from "@/components/MkChip";
  import { defineAsyncComponent } from "vue";
  import { useI18next } from "@/composables/useI18next";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts";
  import { onDeactivated } from "vue";
  import { KeyboardShortcutCollection } from "@/models/keyboard/KeyboardShortcutCollection";

  // define properties and events
  const props = defineProps<{
    modelValue: TableFilter;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilter): void;
  }>();

  // inject dependencies
  const { defaultT } = await useI18next();
  const { addKeyboardShortcuts, removeKeyboardShortcuts } = useKeyboardShortcuts();

  // define reactive variables
  const menu = ref(false);

  // check if we have a filter value
  const containsFilterValue = computed(() => {
    return props.modelValue && Object.keys(props.modelValue).some((key) => props.modelValue[key].selectedValue !== undefined);
  });

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
    const copy = { ...props.modelValue };

    // get value and set it to selected filter values
    if (state.currentFilter !== undefined) {
      if (state.currentFilterValue !== undefined) {
        copy[state.currentFilterKey!].selectedValue = state.currentFilterValue;
      } else if (copy[state.currentFilterKey!]) {
        // delete the filter value if we had a value, but it is now undefined
        copy[state.currentFilterKey!].selectedValue = undefined;
      }
    }
    // emit an event telling the selected filters have changed
    emit("update:modelValue", copy);

    closeFilter();
    closeMenu();
  }

  /* Removed the filterItem id from the modelValue collection. */
  function removeFilter(key: string) {
    const copy = { ...props.modelValue };

    // delete the filter value if we had a value, but it is now undefined
    copy[key].selectedValue = undefined;

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

  /** Define Keybinding collection */
  const shortCuts: KeyboardShortcutCollection = {
    "control+f": (e: KeyboardEvent) => {
      e.preventDefault();
      openMenu();
    },
  };

  addKeyboardShortcuts(shortCuts);

  onDeactivated(() => {
    removeKeyboardShortcuts(shortCuts);
  });
</script>

<template>
  <v-card class="mk-table-filter mb-4" variant="flat" rounded="10" color="surface1">
    <v-container fluid>
      <v-row class="pb-2">
        <template v-if="modelValue">
          <v-menu v-model="menu" :close-on-content-click="false" location="end" colo>
            <!-- Button -->
            <template #activator="args">
              <v-btn class="mt-1 ml-1" v-bind="args.props" color="on-surface1" variant="plain" :icon="IconsLibrary.filterVariant"> </v-btn>
            </template>

            <!-- context menu -->
            <v-list v-if="!state.currentFilter">
              <v-list-item v-for="key in Object.keys(modelValue)" :key="key" :value="modelValue[key]" @click="changeCurrentFilter(key, modelValue[key])">
                <v-list-item-title>{{ modelValue[key].title }}</v-list-item-title>
              </v-list-item>
            </v-list>

            <!-- filter compoment -->
            <template v-else-if="state.currentFilter">
              <Suspense>
                <component
                  :is="GetComponentForFilterType(state.currentFilter)"
                  v-model="state.currentFilterValue"
                  :table-filter-item="state.currentFilter"
                  @click:close="closeMenu"
                  @update:model-value="applyFilter"
                />
                <template #fallback>
                  <v-card>
                    {{ defaultT("Loading filter...") }}
                  </v-card>
                </template>
              </Suspense>
            </template>
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
            :placeholder="!containsFilterValue ? defaultT('Filter') : ''"
            variant="plain"
            :hide-details="true"
            readonly
            density="compact"
            class="mk-table-filter__input mx-2"
            color="on-surface1"
            @click="openMenu"
            @keypress.enter="openMenu"
          ></v-text-field>
        </template>
      </v-row>
    </v-container>
  </v-card>
</template>

<stlye lang="scss" scoped>
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
