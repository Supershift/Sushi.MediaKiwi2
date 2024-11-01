<script setup lang="ts">
  import { TableColumn } from "@/models/table/TableColumn";
  import { useTableDisplayOptions } from "@/composables/useTableDisplayOptions";
  import { useSnackbarStore } from "@/stores";
  import { useI18next } from "@/composables/useI18next";
  import { computed, reactive } from "vue";
  import { TableDisplayOptions } from "@/models/table/TableDisplayOptions";

  // inject dependencies
  const { setColumnVisibility } = useTableDisplayOptions();
  const snackbar = useSnackbarStore();
  const { defaultT } = await useI18next("MKDisplayOptions");

  const state = reactive({
    menuState: false,
    isEdited: false,
  });

  /** Display Options */
  const displayOptions = defineModel<TableDisplayOptions | boolean>("displayOptions", { required: false, default: [] });
  const hasDisplayOptions = computed(() => displayOptions.value !== undefined && displayOptions.value !== false);
  const hasColumns = computed(() => hasDisplayOptions.value && (displayOptions.value as TableDisplayOptions)?.columns?.length);

  const loadedColumns = computed(() => (displayOptions.value as TableDisplayOptions).columns);
  /** TODO: Define Table Reference for when multiple tables are on one view */
  const tableReference = defineModel<string | undefined>("tableReference", { required: false });

  /**
   * Update the display columns
   * @param column table columns to update
   */
  function updateDisplayColumns(column: TableColumn) {
    state.isEdited = true;
    // Update the visibility of the columns when the user changes the options in the list
    setColumnVisibility((displayOptions.value as TableDisplayOptions).columns!, column, tableReference.value, true);
  }

  function onModelStateChange(value: boolean) {
    if (!value && state.isEdited) {
      // Notify the user
      snackbar.showMessage(defaultT.value("DisplayOptionsVisibilityChanged", "The visibility of the columns has been adjusted."));
    } else {
      // Reset the state
      state.isEdited = false;
    }
  }
</script>
<template>
  <div class="mk-display-options">
    <v-menu v-if="hasColumns" v-model="state.menuState" @update:model-value="onModelStateChange" :close-on-back="false" :close-on-content-click="false">
      <!-- Button -->
      <template #activator="args">
        <v-btn v-bind="args.props" variant="text" class="mk-display-options__button">
          {{ defaultT("DisplayOptions", "Display options") }}
        </v-btn>
      </template>
      <v-list class="mk-display-options__list">
        <v-list-item v-for="column in loadedColumns" :key="column.index" class="mk-display-options__list-item">
          <v-checkbox v-model="column.visible" @update:modelValue="updateDisplayColumns(column)" :label="column.name" hide-details></v-checkbox>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
