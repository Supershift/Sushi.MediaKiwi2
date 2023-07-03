<script setup lang="ts">
  import { Country } from "@/models/Country";
  import { CountryConnector } from "@/services/CountryConnector";
  import { ListResult, MkTable, TableMap, MkSideSheet } from "@supershift/mediakiwi-vue";
  import { container } from "tsyringe";
  import { ref } from "vue";

  // inject dependencies
  const connector = container.resolve(CountryConnector);

  // define reactive variables
  const currentPage = ref(0);
  const countries = ref<ListResult<Country>>();

  // define sheet example variables
  const toggle = ref(false);
  const countryItem = ref<Country>();

  const exampleChoice = ref("primary");
  const example_cb = ref(["name"]);
  const example_radio = ref("name");
  const example_range = ref(0);
  const example_select = ref(["name", "code"]);

  // define mapping
  const tableMap: TableMap<Country> = {
    itemId: (x) => x.code,
    items: [
      { headerTitle: "Code", value: (x) => x.code },
      { headerTitle: "Name", value: (x) => x.name },
    ],
  };

  // load data
  async function LoadData() {
    countries.value = await connector.GetAll({ pageIndex: currentPage.value });
  }
  async function RowClicked(item: Country) {
    console.log(item);
    // toggle sidesheet
    exampleChoice.value = "list-view";
    example_radio.value = "name";
    countryItem.value = item;
    toggle.value = true;
  }
  async function close() {
    toggle.value = false;
  }
</script>
<template>
  <!-- CHOICES -->
  <v-radio-group v-if="toggle" v-model="exampleChoice" inline>
    <v-radio label="list-view" color="info" value="list-view"></v-radio>
    <v-radio label="table-view" color="info" value="table-view"></v-radio>
    <v-radio label="filters-view" color="info" value="filters-view"></v-radio>
    <v-radio label="info-view" color="info" value="info-view"></v-radio>
  </v-radio-group>
  <v-card>
    <mk-table v-model:current-page="currentPage" :api-result="countries" :table-map="tableMap" :on-load="LoadData" @click:row="RowClicked"></mk-table>
  </v-card>
  <!-- Side sheet demo  -->
  <mk-side-sheet :model-value="toggle" @closed="close">
    <template #header>
      <h3>
        {{ countryItem?.name ?? "[TITLE]" }}
      </h3>
    </template>
    <template #default>
      <!-- DEMO: List-->
      <v-list v-if="exampleChoice === 'list-view'" disabled>
        <v-list-subheader>START</v-list-subheader>

        <v-list-item v-for="i in 20" :key="i">
          <template #prepend>
            <v-icon>mdi-flag</v-icon>
          </template>

          <v-list-item-title v-text="countryItem?.name ?? '[NAME]'"></v-list-item-title>
          <v-list-item-subtitle v-text="countryItem?.code ?? '[CODE]'"></v-list-item-subtitle>
        </v-list-item>
        END
      </v-list>
      <v-card v-if="exampleChoice === 'table-view'">
        <mk-table v-model:current-page="currentPage" :api-result="countries" :table-map="tableMap" :on-load="LoadData" @click:row="RowClicked"></mk-table>
      </v-card>
      <v-card v-if="exampleChoice === 'filters-view'">
        <v-list disabled>
          <v-list-subheader>Include</v-list-subheader>
          <v-list-item>
            <v-checkbox v-model="example_cb" label="Filter name" value="name"></v-checkbox>
            <v-checkbox v-model="example_cb" label="Filter code" value="code"></v-checkbox>
            <v-checkbox v-model="example_cb" label="Filter language" value="lang"></v-checkbox>
            <v-checkbox v-model="example_cb" label="Filter color" value="color"></v-checkbox>
          </v-list-item>
        </v-list>
        <v-text-field label="Search" append-icon="mdi-magnify" clearable></v-text-field>
        <v-select :items="example_select" label="Exclude"></v-select>
        <v-card-text>
          <v-slider v-model="example_range" label="Range" thumb-color="primary"></v-slider>
        </v-card-text>
        <v-list disabled>
          <v-list-subheader>Order by</v-list-subheader>
          <v-list-item>
            <v-radio-group v-model="example_radio" column>
              <v-radio color="info" label="name" value="name"></v-radio>
              <v-radio color="info" label="code" value="code"></v-radio>
              <v-radio color="info" label="language" value="lang"></v-radio>
              <v-radio color="info" label="color" value="color"></v-radio>
            </v-radio-group>
          </v-list-item>
        </v-list>
      </v-card>
      <!-- End DEMO: List -->
    </template>
    <template #footer>
      <!-- <v-btn class="d-inline-block" variant="text">action 1</v-btn>
      <v-btn class="d-inline-block" variant="text">action 2</v-btn> -->
    </template>
  </mk-side-sheet>
</template>
