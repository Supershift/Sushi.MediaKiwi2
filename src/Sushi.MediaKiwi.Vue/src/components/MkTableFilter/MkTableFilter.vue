<script setup lang="ts">
  import { shallowReactive, ref, watch } from "vue";
  import { TableFilter } from "@/models/table/ITableFilter";
  import { TableFilterItem } from "@/models/table/ITableFilterItem";
  import { TableFilterValue } from "@/models/table/ITableFilterValue";

  const props = defineProps<{
    modelValue: TableFilter;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilter): void;
  }>();

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
  <v-card variant="tonal">
    <v-container>
      <v-row class="pb-2">
        <v-menu v-model="menu" :close-on-content-click="false" location="end">
          <!-- Button -->
          <template v-slot:activator="{ props }">
            <v-btn class="mt-1 ml-1" v-bind="props" color="primary" variant="plain" icon="mdi-filter-variant"> </v-btn>
          </template>

          <!-- context menu -->
          <v-list v-if="!state.currentFilter">
            <v-list-item v-for="key in Object.keys(modelValue)" :value="modelValue[key]" @click="changeCurrentFilter(key, modelValue[key])">
              <v-list-item-title>{{ modelValue[key].title }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <!-- filter compoment -->
          <v-card v-else-if="state.currentFilter" width="300" :title="state.currentFilter.title">
            <component :is="state.currentFilter.component" :table-filter-item="state.currentFilter" v-model="state.currentFilterValue"> </component>
            <v-card-actions>
              <v-btn @click="applyFilter()">Apply</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <!-- Chips -->
        <template v-for="key in Object.keys(modelValue)">
          <v-chip class="ml-2 mt-2" v-if="modelValue[key].selectedValue" @click="setCurrentFilter(key, modelValue[key])"
            >{{ modelValue[key].title }} : {{ modelValue[key].selectedValue?.title }}
            <v-btn class="my-1 ml-1" color="default" density="compact" size="small" icon="mdi-close-circle" @click.prevent="removeFilter(key)"></v-btn>
          </v-chip>
        </template>

        <v-text-field placeholder="Filter" @click="openMenu" variant="plain" :hide-details="true" readonly density="compact" class="mx-2"></v-text-field>
      </v-row>
    </v-container>
  </v-card>
</template>

<stlye lang="css" scoped>
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
