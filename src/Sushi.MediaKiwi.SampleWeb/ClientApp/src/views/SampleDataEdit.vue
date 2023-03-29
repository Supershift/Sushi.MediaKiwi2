<script setup lang="ts">
  import { ITableMapItem, MkForm, MkTableView } from "@supershift/mediakiwi-vue";
  import { useRoute, useRouter } from "@supershift/mediakiwi-vue";
  import type { ITableMap } from "@supershift/mediakiwi-vue";
  import { SampleDataService } from "../components/SampleDataService";
  import type { ISampleData } from "../components/ISampleData";
  import { reactive, ref } from "vue";

  const route = useRoute();
  const router = useRouter();

  const countries = [
    { title: "Nederland", value: "NL" },
    { title: "België", value: "BE" },
  ];

  function onButtonClick() {
    router.push({
      name: "Sample-deep-data-edit",
      params: {
        sampleDataId: route.params.sampleDataId,
        deepDataId: "abcd-124",
      },
    });
  }

  interface DeepData {
    id: string;
    name: string;
  }

  const deepDataItems: DeepData[] = [
    { id: "abc-123", name: "hello" },
    { id: "dfh-235", name: "good" },
    { id: "dfsdg", name: "bye" },
  ];

  const myMap = <ITableMap<DeepData>>{
    itemId: (item) => item.id,
    items: [{ headerTitle: "Name", value: (dataItem) => dataItem.name }],
  };

  var candidate = SampleDataService.Get(Number(route.params.sampleDataId));

  var state = reactive({
    data: candidate ? candidate : <ISampleData>{},
  });

  function onSave() {
    SampleDataService.Save(state.data);
  }

  function onUndo() {
    candidate = SampleDataService.Get(Number(route.params.sampleDataId));
    state.data = candidate ? candidate : <ISampleData>{};
  }

  function onDelete() {
    SampleDataService.Delete(state.data.id);
  }

  const showMore = ref(false);
</script>

<template>
  <v-card class="ma-5">
    <MkForm title="Sample data edit" @save="onSave" @undo="onUndo" @delete="onDelete">
      <v-text-field label="Name" v-model="state.data.name"></v-text-field>
      <v-select label="Country Code" v-model="state.data.countryCode" :items="countries"></v-select>
    </MkForm>
    <v-btn @click="showMore = !showMore">Show more</v-btn>
    <div v-show="showMore">
      <v-divider></v-divider>
      Manually go a level deeper: <v-btn @click="onButtonClick">Level deeper</v-btn>
      <v-divider></v-divider>
      Use a table to go a level deeper:
      <MkTableView :data="deepDataItems" :table-map="myMap" item-view-id="SampleDeepEdit"></MkTableView>
    </div>
  </v-card>
</template>
