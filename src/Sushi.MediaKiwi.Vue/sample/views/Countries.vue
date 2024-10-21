<script setup lang="ts">
  import { Country } from "./../models/Country";
  import { CountryConnector } from "./../services/CountryConnector";
  import { MkTable } from "@/components";
  import { useI18next, useKeyboardShortcuts } from "@/composables";
  import { ListResult, TableMap, Paging, KeyboardShortcutCollection } from "@/models";
  import { container } from "tsyringe";
  import { reactive } from "vue";
  import { onDeactivated } from "vue";
  import { ref } from "vue";
  import CountryEdit from "./CountryEdit.vue";

  // inject dependencies
  const { addKeyboardShortcuts, removeKeyboardShortcuts } = useKeyboardShortcuts();
  const connector = container.resolve(CountryConnector);
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
    state.countries = await connector.GetAll(currentPagination.value);
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
    <template #toolbarTitle>
      <v-text-field label="Sample field that does nothing"></v-text-field>
    </template>

    <template #thead>
      <th>Code</th>
      <th>Name</th>
    </template>

    <template #tbody="{ dataItem }">
      <td>{{ dataItem.code }}</td>
      <td>{{ dataItem.name }}</td>
    </template>
  </mk-table>

  <CountryEdit v-model="state.addCountry" />
</template>
