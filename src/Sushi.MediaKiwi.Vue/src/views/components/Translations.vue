<script setup lang="ts">
  import { IAdminTranslationConnector } from "@/services/interfaces";
  import { container } from "tsyringe";
  import { MkTable, MkSideSheet, MkForm } from "@/components";
  import { ref, reactive } from "vue";
  import { ListResult, Paging, TableFilter, TableFilterType, TableFilterValue, TableMap, Translation } from "@/models";
  import { useI18next } from "@/composables";
  import { useSnackbarStore } from "@/stores/snackbar";

  // define properties
  const props = defineProps({
    /** locale for which to display translations  */
    localeId: {
      type: String,
      required: true,
    },
  });

  // inject dependencies
  const connector = container.resolve<IAdminTranslationConnector>("IAdminTranslationConnector");
  const { defaultT } = await useI18next();
  const snackbar = useSnackbarStore();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const translations = ref<ListResult<Translation>>();
  const inProgress = ref(false);
  const state = reactive({
    translation: {} as Translation,
    showEditTranslation: false,
  });

  // define mapping
  const tableMap: TableMap<Translation> = {
    items: [
      { headerTitle: defaultT.value("Namespace"), value: (item) => item.namespace },
      { headerTitle: defaultT.value("Key"), value: (item) => item.key },
      { headerTitle: defaultT.value("Value"), value: (item) => item.value },
    ],
  };

  // define filters
  const filters = ref<TableFilter>({
    namespaces: {
      title: defaultT.value("Namespace"),
      type: TableFilterType.Select,
      options: [],
    },
    key: {
      title: defaultT.value("Key"),
      type: TableFilterType.Select,
      options: [],
    },
    value: {
      title: defaultT.value("Value"),
      type: TableFilterType.TextField,
    },
  });

  // load data
  async function LoadData() {
    const selectedNamespace = filters.value.namespaces.selectedValue?.value;
    const selectedKey = filters.value.key.selectedValue?.value;
    const selectedValue = filters.value.value.selectedValue?.value;
    translations.value = await connector.GetAll(props.localeId, selectedNamespace, selectedKey, selectedValue);
  }

  // get filter options
  const namespaces = await connector.GetNamespaces(props.localeId);
  const keys = await connector.GetKeys(props.localeId);

  // Set filter options
  filters.value.namespaces.options = namespaces.result.map((ns) => <TableFilterValue>{ title: ns, value: ns });
  filters.value.key.options = keys.result.map((ns) => <TableFilterValue>{ title: ns, value: ns });

  // handle events
  function onRowClick(item: any) {
    console.log(item);
    state.translation = item;
    state.showEditTranslation = true;
  }

  async function onSave(): Promise<void> {
    inProgress.value = true;
    try {
      await connector.Update(state.translation);
      snackbar.showMessage(defaultT.value("Saved successfully"));
      state.showEditTranslation = false;
    } catch (error) {
      snackbar.showMessage(defaultT.value("Failed to save"));
    } finally {
      inProgress.value = false;
    }
  }
</script>

<template>
  <mk-table
    @click:row="onRowClick"
    :table-map="tableMap"
    v-model:filters="filters"
    :on-load="LoadData"
    :data="translations?.result"
    v-model:current-pagination="currentPagination"
  >
  </mk-table>

  <mk-side-sheet v-model="state.showEditTranslation" close-button>
    <template #default>
      <div class="mt-4">
        <v-text-field disabled :label="defaultT('Namespace')" v-model="state.translation.namespace"></v-text-field>
        <v-text-field disabled :label="defaultT('Key')" v-model="state.translation.key"></v-text-field>
        <v-textarea :label="defaultT('Value')" v-model="state.translation.value"></v-textarea>
      </div>
    </template>
    <template #footer>
      <v-btn @click="onSave">{{ defaultT("Save") }}</v-btn>
      <v-btn @click="state.showEditTranslation = false">{{ defaultT("Close") }}</v-btn>
    </template>
  </mk-side-sheet>
</template>
