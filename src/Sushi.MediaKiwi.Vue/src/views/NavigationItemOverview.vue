<script setup lang="ts">
  import { MkTable } from "@/components";
  import { ListResult, Paging, NavigationItem } from "@/models";
  import { useMediakiwiStore } from "@/stores";
  import { ref } from "vue";
  import { container } from "tsyringe";
  import { INavigationConnector } from "@/services";
  import { reactive } from "vue";

  // inject dependencies
  const navigationConnector = container.resolve<INavigationConnector>("INavigationConnector");
  const store = useMediakiwiStore();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const sections = ref(store.sections);
  const navigationItems = ref(store.navigationItems);

  const state = reactive({
    navigationItems: <ListResult<NavigationItem>>{},
  });

  function getSectionName(id: number): string | undefined {
    return sections.value.find((section) => section.id == id)?.name;
  }

  function getNavigationItemName(id?: number): string | undefined {
    return navigationItems.value.find((x) => x.id == id)?.name || "-";
  }

  // get data
  async function onLoad() {
    state.navigationItems = await navigationConnector.GetNavigationItems(currentPagination.value);
  }
</script>
<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    new
    :api-result="state.navigationItems"
    @load="onLoad"
    item-view-id="MkNavigationItemEdit"
    :item-id="(item) => item.id"
  >
    <template #thead>
      <th>Name</th>
      <th>Section</th>
      <th>Parent</th>
      <th>View</th>
      <th>Icon</th>
    </template>
    <template #tbody="item: NavigationItem">
      <th>{{ item.name }}</th>
      <th>{{ getSectionName(item.sectionId) }}</th>
      <th>{{ getNavigationItemName(item.parentNavigationItemId) }}</th>
      <th>{{ item.viewId }}</th>
      <th>{{ item.icon }}</th></template
    >
  </mk-table>
</template>
