<script setup lang="ts">
  import { Country } from "@/models/Country";
  import { CountryConnector } from "@/services/CountryConnector";
  import { ListResult, MkTable, TableMap, useKeyboardShortcuts } from "@supershift/mediakiwi-vue";
  import type { Paging, KeyboardShortcutCollection } from "@supershift/mediakiwi-vue";
  import { container } from "tsyringe";
  import { onDeactivated } from "vue";
  import { ref } from "vue";

  const { addKeyboardShortcuts, removeKeyboardShortcuts } = useKeyboardShortcuts();

  // inject dependencies
  const connector = container.resolve(CountryConnector);

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const countries = ref<ListResult<Country>>();

  // define mapping
  const tableMap: TableMap<Country> = {
    itemId: (x) => x.code,
    items: [
      { headerTitle: "Code", value: (x) => x.code },
      { headerTitle: "Name", value: (x) => x.name },
      {
        headerTitle: "Toggle",
      },
    ],
  };

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
    countries.value = await connector.GetAll(currentPagination.value);
  }
</script>
<template>
  <mk-table v-model:currentPagination="currentPagination" :api-result="countries" :table-map="tableMap" :on-load="LoadData"></mk-table>
</template>
