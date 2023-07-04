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
  const example_selection = ref(1);
  const example_loading = ref(false);

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
  async function reserve() {
    example_loading.value = true;

    setTimeout(() => (example_loading.value = false), 2000);
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
      <v-list v-if="exampleChoice === 'list-view'">
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
      <!-- End DEMO: List -->
      <!-- Start DEMO: Table -->
      <v-card v-if="exampleChoice === 'table-view'">
        <mk-table v-model:current-page="currentPage" :api-result="countries" :table-map="tableMap" :on-load="LoadData" @click:row="RowClicked"></mk-table>
      </v-card>
      <!-- End DEMO: Table -->
      <!-- Start DEMO: Filters -->
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
      <!-- End DEMO: Filters -->
      <!-- Start DEMO: Info -->
      <v-card v-if="exampleChoice === 'info-view'" :loading="example_loading" class="mx-auto" max-width="374">
        <template #loader="{ isActive }">
          <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate></v-progress-linear>
        </template>

        <v-img cover height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>

        <v-card-item>
          <v-card-title>Cafe Badilico</v-card-title>

          <v-card-subtitle>
            <span class="me-1">Local Favorite</span>

            <v-icon color="error" icon="mdi-fire-circle" size="small"></v-icon>
          </v-card-subtitle>
        </v-card-item>

        <v-card-text>
          <v-row align="center" class="mx-0">
            <v-rating :model-value="4.5" color="amber" density="compact" half-increments readonly size="small"></v-rating>

            <div class="text-grey ms-4">4.5 (413)</div>
          </v-row>

          <div class="my-4 text-subtitle-1">$ • Italian, Cafe</div>

          <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>
        </v-card-text>

        <v-divider class="mx-4 mb-1"></v-divider>

        <v-card-title>Tonight's availability</v-card-title>

        <div class="px-4">
          <v-chip-group v-model="example_selection">
            <v-chip>5:30PM</v-chip>

            <v-chip>7:30PM</v-chip>

            <v-chip>8:00PM</v-chip>

            <v-chip>9:00PM</v-chip>
          </v-chip-group>
        </div>

        <v-card-actions>
          <v-btn color="deep-purple-lighten-2" variant="text" @click="reserve"> Reserve </v-btn>
        </v-card-actions>
      </v-card>
    </template>
    <template #footer>
      <!-- <v-btn class="d-inline-block" variant="text">action 1</v-btn>
      <v-btn class="d-inline-block" variant="text">action 2</v-btn> -->
    </template>
  </mk-side-sheet>
</template>
