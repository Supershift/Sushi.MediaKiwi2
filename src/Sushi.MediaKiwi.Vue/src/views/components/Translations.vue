<script setup lang="ts">
  import { MkTable, MkFormSideSheet } from "@/components";
  import { ref, reactive } from "vue";
  import { ListResult, Paging, TableFilter, TableFilterType, TableFilterValue, TableMap, Translation } from "@/models";
  import { useI18next } from "@/composables";
  import { useSnackbarStore } from "@/stores/snackbar";
  import { useMediaKiwiApi } from "@/services";

  // define properties
  const props = defineProps({
    /** locale for which to display translations  */
    localeId: {
      type: String,
      required: true,
    },
  });

  // inject dependencies
  const mediaKiwiApi = useMediaKiwiApi();
  const { defaultT, t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const translations = ref<ListResult<Translation>>();
  const state = reactive({
    translation: <Translation>{},
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
      type: TableFilterType.SingleSelect,
      options: [],
    },
    key: {
      title: defaultT.value("Key"),
      type: TableFilterType.SingleSelect,
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

    const response = await mediaKiwiApi.adminTranslations({
      localeId: props.localeId,
      namespace: selectedNamespace,
      key: selectedKey,
      value: selectedValue,
    });
    translations.value = {
      ...response.data,
      result:
        response.data?.result?.map((t) => ({
          ...t,
          localeId: t.localeId ?? "",
          namespace: t.namespace ?? "",
          key: t.key ?? "",
          value: t.value ?? "",
        })) ?? [],
    };
  }

  // get filter options
  const namespaces = await mediaKiwiApi.adminTranslationsNamespaces({ localeId: props.localeId });
  const keys = await mediaKiwiApi.adminTranslationsKeys({ localeId: props.localeId });

  // Set filter options
  filters.value.namespaces.options = (namespaces.data?.result ?? []).map((ns) => <TableFilterValue>{ title: ns, value: ns });
  filters.value.key.options = (keys.data?.result ?? []).map((ns) => <TableFilterValue>{ title: ns, value: ns });

  // handle events
  function onRowClick(item: Translation) {
    state.translation = { ...item };
    state.editTranslationValue = item.value;
    state.showEditTranslation = true;
  }

  async function onSave(): Promise<void> {
    const item = {
      ...state.translation,
      value: state.editTranslationValue,
    };
    await mediaKiwiApi.adminTranslationsUpdate(item.localeId, item.namespace, item.key, item);

    // update model value if successful
    state.translation = {
      ...state.translation,
      value: state.editTranslationValue,
    };

    // close the side sheet
    state.showEditTranslation = false;

    // Update the translations list
    LoadData();
  }
</script>

<template>
  <mk-table
    @click:row="onRowClick"
    :table-map="tableMap"
    v-model:filters="filters"
    @load="LoadData"
    :data="translations?.result"
    v-model:current-pagination="currentPagination"
  ></mk-table>

  <MkFormSideSheet :title="t('EditTranslationTitle', 'Edit Translation')" v-model="state.showEditTranslation" @submit="onSave" edit-labels>
    <v-text-field disabled :label="defaultT('Namespace')" v-model="state.translation.namespace"></v-text-field>
    <v-text-field disabled :label="defaultT('Key')" v-model="state.translation.key"></v-text-field>
    <v-textarea :label="defaultT('Value')" v-model="state.editTranslationValue"></v-textarea>
  </MkFormSideSheet>
</template>
