<script setup lang="ts">
  import { TableColumn } from "@/models/table/TableColumn";
  import { useTableDisplayOptions } from "@/composables/useTableDisplayOptions";
  import { useSnackbarStore } from "@/stores";
  import { useI18next } from "@/composables/useI18next";
  import { computed } from "vue";

  // inject dependencies
  const { setColumnVisibility } = useTableDisplayOptions();
  const snackbar = useSnackbarStore();
  const { defaultT } = await useI18next("MKDisplayOptions");

  /** Display Options */
  const displayOptions = defineModel<TableColumn[] | boolean>("displayOptions", { required: false, default: [] });
  const hasDisplayOptions = computed(() => displayOptions.value !== undefined && displayOptions.value !== false);
  const availableColumns = computed(() => displayOptions.value as TableColumn[]);
  /** TODO: Define Table Reference for when multiple tables are on one view */
  const tableReference = defineModel<string | undefined>("tableReference", { required: false });

  /**
   * Update the display columns
   * @param column table columns to update
   */
  function updateDisplayColumns(column: TableColumn) {
    setColumnVisibility(displayOptions.value as TableColumn[], column, tableReference.value);
    // Notify the user
    snackbar.showMessage(defaultT.value("DisplayOptionsVisibilityChanged", "The visibility of the columns has been adjusted."));
  }
</script>
<template>
  <div class="mk-display-options">
    <v-menu close-on-content-click v-if="hasDisplayOptions">
      <!-- Button -->
      <template #activator="args">
        <v-btn v-bind="args.props" variant="text" class="mk-display-options__button mr-4">
          {{ defaultT("DisplayOptions", "Display options") }}
        </v-btn>
      </template>
      <v-list class="mk-display-options__list">
        <v-list-item v-for="column in availableColumns" :key="column.index" class="mk-display-options__list-item">
          <v-checkbox v-model="column.visible" @update:modelValue="updateDisplayColumns(column)" :label="column.name"></v-checkbox>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<style scoped lang="scss">
  @use "@/styles/abstracts";

  .mk-display-options {
    display: flex;
  }
</style>
