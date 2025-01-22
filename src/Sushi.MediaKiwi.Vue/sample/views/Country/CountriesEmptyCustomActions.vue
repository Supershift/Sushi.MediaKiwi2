<script setup lang="ts">
  import { Country } from "../../models/Country";
  import { MkTable } from "@/components";
  import { useI18next } from "@/composables";
  import { ListResult, Paging } from "@/models";
  import { reactive, ref } from "vue";

  // inject dependencies
  const { t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const state = reactive({
    countries: <ListResult<Country>>{},
  });

  // load data
  async function LoadData() {
    await new Promise((resolve) =>
      setTimeout(() => {
        state.countries = {
          totalCount: 0,
          result: [],
        };
        resolve(state.countries);
      }, 1000)
    );
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
  >
    <template #thead>
      <th>Code</th>
      <th>Name</th>
    </template>

    <template #tbody="{ dataItem }">
      <td>{{ dataItem.code }}</td>
      <td>{{ dataItem.name }}</td>
    </template>

    <template #emptyStateActions>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-card
              href="https://vuetifyjs.com/introduction/why-vuetify/#feature-guides"
              prepend-icon="$vuetify"
              target="_blank"
              text="Start with our dedicated feature guides"
              title="Learn Vuetify"
            ></v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              href="https://play.vuetifyjs.com"
              prepend-icon="$vuetify-play"
              target="_blank"
              text="Test Vuetify out in our playground"
              title="Create a Playground"
            ></v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              href="https://bin.vuetifyjs.com"
              prepend-icon="mdi-delete"
              target="_blank"
              text="Create a new bin to store your code"
              title="Create a Bin"
            ></v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              href="https://issues.vuetifyjs.com"
              prepend-icon="$warning"
              target="_blank"
              text="File a bug report for Vuetify"
              title="Report a Bug"
            ></v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </mk-table>
</template>
