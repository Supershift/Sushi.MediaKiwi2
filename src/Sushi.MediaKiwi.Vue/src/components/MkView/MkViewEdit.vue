<script setup lang="ts">
  import { MkForm } from "@/components";
  import { reactive } from "vue";
  import { useRoute } from "@/router";
  import { container } from "tsyringe";
  import { IViewConnector } from "@/services";
  import { View } from "@/models";
  import { useMediakiwiStore } from "@/stores";
  import { RouterManager } from "@/router/routerManager";
  // inject dependencies
  const viewConnector = container.resolve<IViewConnector>("IViewConnector");
  const routerManager = container.resolve<RouterManager>("RouterManager");

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

  async function onSave() {
    if (viewId > 0) {
      // update existing
      // call Api to update view
      await viewConnector.UpdateView(viewId, state.view);

      // refresh navigation
      await routerManager.ForceInitialize();
    } else {
      // create new
      alert("Not implemented");
    }
  }

  function onDelete() {
    alert("Not implemented");
  }
</script>

<template>
  <MkForm :on-save="onSave" title="View" @save="onSave" @undo="loadView" @delete="onDelete">
    <v-text-field label="Name" v-model="state.view.name"></v-text-field>
    <v-text-field label="External Id" v-model="state.view.externalId"></v-text-field>
    <v-text-field label="Component key" v-model="state.view.componentKey"></v-text-field>
    <v-select label="Section" v-model="state.view.sectionId" :items="store.sections" item-title="name" item-value="id"></v-select>
    <v-select label="Roles" v-model="state.view.roles" chips multiple :items="store.roles" item-title="id" item-value="id"></v-select>
  </MkForm>
</template>
