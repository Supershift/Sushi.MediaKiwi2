<script setup lang="ts">
  import { MkTable } from "@/components";
  import { useI18next, useKeyboardShortcuts } from "@/composables";
  import { ListResult, Paging, KeyboardShortcutCollection } from "@/models";
  import { reactive } from "vue";
  import { onDeactivated } from "vue";
  import { ref } from "vue";
  import AddCountry from "./AddCountry.vue";
  import { useSampleApi, Country } from "@sample/services";

  // inject dependencies
  const { addKeyboardShortcuts, removeKeyboardShortcuts } = useKeyboardShortcuts();
  const sampleApi = useSampleApi();
  const { t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>({ pageSize: 8 }); // demos 8 items per page (lower than default 10)
  const state = reactive({
    countries: <ListResult<Country>>{},
    addCountry: false,
  });

  /** Define Keybinding collection */
  const shortCuts: KeyboardShortcutCollection = {
    "shift+c": (e: KeyboardEvent) => {
      e.preventDefault();
      alert("You've pressed shift+c, this is a little secret!");
    },
  };

  addKeyboardShortcuts(shortCuts);

  onDeactivated(() => {
    removeKeyboardShortcuts(shortCuts);
  });

  // load data
  async function LoadData() {
    state.countries = (await sampleApi.countries(currentPagination.value)).data;
  }

  function openDialog() {
    state.addCountry = true;
  }
</script>
<template>
  <mk-table
    v-model:currentPagination="currentPagination"
    :api-result="state.countries"
    :data="state.countries?.result"
    @load="LoadData"
    :item-id="(item: Country) => item.code"
    navigation-item-id="CountryEdit"
    new
    :new-title="t('Add Country').toString()"
    new-emit
    page-tracking
    @click:new="openDialog"
  >
    <template #thead>
      <th>Code</th>
      <th>Name</th>
    </template>

    <template #tbody="dataItem: Country">
      <td>{{ dataItem.code }}</td>
      <td>{{ dataItem.name }}</td>
    </template>
  </mk-table>

  <AddCountry v-model="state.addCountry" />
</template>
