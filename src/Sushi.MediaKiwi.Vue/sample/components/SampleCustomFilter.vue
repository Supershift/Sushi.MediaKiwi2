<script setup lang="ts">
  import { TableFilterItem, TableFilterValue } from "@/models";
  import { computed } from "vue";
  import { reactive } from "vue";
  import Tree from "./Tree.vue";
  import { ref } from "process";

  // Inject dependencies
  const emit = defineEmits<(e: "click:close") => void>();

  const modelValue = defineModel<TableFilterValue>({ required: true });
  const isCountry = (item: any) => {
    return item && item.region && item.value;
  };
  defineProps<{
    tableFilterItem?: TableFilterItem;
  }>();

  const width = computed(() => (state.showFolderTree ? 512 : 312));

  function onClose() {
    emit("click:close");
  }

  function onBack() {
    state.showFolderTree = false;
    state.selection = [];
  }

  // Regions with there countries nested in countries[]
  const regionsWithCountries = [
    {
      title: "Europa",
      value: "EU",
      countries: [
        { title: "Nederland", value: "NL" },
        { title: "België", value: "BE" },
        { title: "United Kingdom", value: "UK" },
        { title: "Duitsland", value: "DE" },
        { title: "Frankrijk", value: "FR" },
      ],
    },
    {
      title: "Noord-Amerika",
      value: "NA",
      countries: [
        { title: "Amerika", value: "US" },
        { title: "Verenigde Staten", value: "US" },
        { title: "Canada", value: "CA" },
      ],
    },
    {
      title: "Zuid-Amerika",
      value: "SA",
      countries: [
        { title: "Brazilië", value: "BR" },
        { title: "Mexico", value: "MX" },
      ],
    },
    {
      title: "Azië",
      value: "AS",
      countries: [
        { title: "Japan", value: "JP" },
        { title: "China", value: "CN" },
        { title: "India", value: "IN" },
      ],
    },
    {
      title: "Afrika",
      value: "AF",
      countries: [{ title: "Zuid-Afrika", value: "ZA" }],
    },
    {
      title: "Oceanië",
      value: "OC",
      countries: [
        { title: "Nieuw-Zeeland", value: "NZ" },
        { title: "Australië", value: "AU" },
      ],
    },
  ];

  const state = reactive({
    showFolderTree: false,
    selection: <Array<any>>[],
    selectedRegionId: undefined,
    selectedCountryId: undefined,
    regions: <Array<any>>[],
    products: <Array<any>>[
      { title: "Product 1", value: "product1" },
      { title: "Product 2", value: "product2" },
      { title: "Product 3", value: "product3" },
    ],
  });

  async function loadAssets() {
    state.regions = [...regionsWithCountries];
    state.showFolderTree = true;
  }

  async function onContinue() {
    await loadAssets();
  }

  async function onApplyFilter() {
    const asset = state.selection[0] ?? undefined;

    const value = <TableFilterValue>{
      ...asset,
    };

    modelValue.value = { ...value };
  }
</script>
<template>
  <v-card class="mk-table-filter__item" rounded="xl" variant="elevated" :width="width">
    <v-card-title tag="h6" class="text-headline-small pa-6 pb-4 ma-0"> Custom filter </v-card-title>
    <v-divider class="mx-2" />

    <template v-if="!state.showFolderTree">
      <v-card-text v-if="state.products?.length" class="px-4 pb-4">
        <v-autocomplete v-model="state.selectedRegionId" :items="state.products" label="Product" hide-details />
      </v-card-text>

      <v-divider class="mx-2" />
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn @click="onClose"> Cancel </v-btn>
        <v-btn @click="onContinue"> Continue</v-btn>
      </v-card-actions>
    </template>
    <template v-else>
      <Tree v-if="state.showFolderTree && state.regions" v-model:selection="state.selection" v-model:items="state.regions" class="py-2 px-4"></Tree>

      <v-divider class="mx-2" />
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn @click="onBack"> Back</v-btn>
        <v-btn @click="onApplyFilter"> Apply</v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>
