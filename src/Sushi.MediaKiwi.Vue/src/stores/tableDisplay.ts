import { defineStore } from "pinia";
import { TableDisplayOptions } from "@/models/table/TableDisplayOptions";
import { computed, ref } from "vue";
import { useNavigation } from "@/composables";
import { DISPLAY_OPTIONS_KEY } from "@/constants";

export const useTableDisplayStore = defineStore("tableDisplay", () => {
  const displayOptions = ref<TableDisplayOptions>();
  const { currentNavigationItem } = useNavigation();
  const navItemRef = computed(() => currentNavigationItem.value?.id || "");
  const displayOptionsKey = computed(() => `${DISPLAY_OPTIONS_KEY}_${navItemRef.value}`);

  async function setDisplayOptions(options: TableDisplayOptions, tableRef?: string) {
    // Set the display options
    displayOptions.value = { ...options };

    // if there is more than one table use the reference also
    let storageKey = displayOptionsKey.value;

    if (tableRef) {
      storageKey += `_${tableRef}`;
    }

    // Save the display options to the local storage
    localStorage.setItem(storageKey, JSON.stringify(displayOptions.value));
  }

  function getDisplayOptions(tableRef?: string) {
    if (displayOptionsKey.value) {
      fetchDisplayOptions(tableRef);
    }

    return displayOptions.value || {};
  }

  /**
   * Gets the table columns from the local storage
   * @returns TableColumn[] an Array of table columns retrieved from the local storage
   */
  async function fetchDisplayOptions(tableRef?: string) {
    // if there is more than one table use the reference also
    let storageKey = displayOptionsKey.value;

    if (tableRef) {
      storageKey += `_${tableRef}`;
    }

    let tableDisplayOptions: TableDisplayOptions = JSON.parse(localStorage.getItem(storageKey) || "{}");

    // Check the table data
    if (!tableDisplayOptions) {
      tableDisplayOptions = {};
    }

    displayOptions.value = tableDisplayOptions;
  }

  fetchDisplayOptions();

  return { displayOptions, setDisplayOptions, getDisplayOptions, fetchDisplayOptions, displayOptionsKey, navItemRef };
});
