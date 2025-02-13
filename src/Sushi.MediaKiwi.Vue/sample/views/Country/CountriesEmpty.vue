<script setup lang="ts">
  import { MkTable } from "@/components";
  import { useI18next } from "@/composables";
  import { ListResult, Paging } from "@/models";
  import { reactive } from "vue";
  import { ref, computed } from "vue";
  import CountryEdit from "./AddCountry.vue";
  import { Country } from "@sample/services";

  // inject dependencies
  const { t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const state = reactive({
    countries: <ListResult<Country>>{},
    addCountry: false,
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
    @click:new="openDialog"
  >
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
