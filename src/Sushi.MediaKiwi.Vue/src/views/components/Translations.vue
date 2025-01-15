<script setup lang="ts">
  import { IAdminTranslationConnector } from "@/services/interfaces";
  import { container } from "tsyringe";
  import { MkTable, MkFormSideSheet } from "@/components";
  import { ref, reactive } from "vue";
  import { ListResult, Paging, TableFilter, TableFilterType, TableFilterValue, TableMap, Translation } from "@/models";
  import { useI18next, useValidationRules } from "@/composables";
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
  const { defaultT, t } = await useI18next("Translations");
  const snackbar = useSnackbarStore();
  const { required } = await useValidationRules();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const translations = ref<ListResult<Translation>>();
  const inProgress = ref(false);
  const state = reactive({
    translation: {} as Translation,
    editTranslationValue: "",
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
    state.editTranslationValue = item.value;
    state.showEditTranslation = true;
  }

  async function onSave(): Promise<void> {
    await connector.Update({
      ...state.translation,
      value: state.editTranslationValue,
    });

    // update model value if successful
    state.translation = {
      ...state.translation,
      value: state.editTranslationValue,
    };
    state.showEditTranslation = false;
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

  <MkFormSideSheet :title="t('EditTranslationTitle', 'Edit Translation')" v-model="state.showEditTranslation" @submit="onSave">
    <v-text-field disabled :label="defaultT('Namespace')" v-model="state.translation.namespace"></v-text-field>
    <v-text-field disabled :label="defaultT('Key')" v-model="state.translation.key"></v-text-field>
    <v-textarea :label="defaultT('Value')" v-model="state.editTranslationValue" :rules="[required]"></v-textarea>
  </MkFormSideSheet>
</template>
