<script setup lang="ts">
  import { MkForm } from "@/components";
  import { reactive } from "vue";
  import { useRoute } from "@/router";
  import { container } from "tsyringe";
  import { IViewConnector } from "@/services";
  import { View } from "@/models";
  import { useMediakiwiStore } from "@/stores";
  // inject dependencies
  const viewConnector = container.resolve<IViewConnector>("IViewConnector");
  const route = useRoute();
  const store = useMediakiwiStore();

  // get id of the view from the route
  const viewId = Number(route.params.viewId);

  // get data object from API
  const state = reactive({
    view: {} as View,
  });

  async function loadView() {
    if (viewId > 0) {
      const candidate = await viewConnector.GetView(viewId);
      if (!candidate) {
        alert("No view found!");
      }
      state.view = candidate!;
    } else {
      state.view = { id: 0 };
    }
  }

  await loadView();

  function onSave() {}

  function onDelete() {}
</script>

<template>
  <MkForm title="View" @save="onSave" @undo="loadView" @delete="onDelete">
    <v-text-field label="Name" v-model="state.view.name"></v-text-field>
    <v-text-field label="External Id" v-model="state.view.externalId"></v-text-field>
    <v-text-field label="Component key" v-model="state.view.componentKey"></v-text-field>
    <v-select label="Section" v-model="state.view.sectionId" :items="store.sections" item-title="name" item-value="id"></v-select>
    <v-select label="Roles" v-model="state.view.roles" chips multiple :items="store.roles" item-title="id" item-value="id"></v-select>
  </MkForm>
</template>
