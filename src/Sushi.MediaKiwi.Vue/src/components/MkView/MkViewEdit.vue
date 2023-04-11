<script setup lang="ts">
  import { MkForm } from "@/components";
  import { reactive } from "vue";
  import { useRoute } from "@/router";
  import { container } from "tsyringe";
  import { IViewConnector } from "@/services";
  import { View } from "@/models";
  import { useMediakiwiStore } from "@/stores";
  import { RouterManager } from "@/router/routerManager";
  import { useNavigation } from "@/composables/useNavigation";
  // inject dependencies
  const viewConnector = container.resolve<IViewConnector>("IViewConnector");
  const routerManager = container.resolve<RouterManager>("RouterManager");

  const route = useRoute();
  const store = useMediakiwiStore();
  const navigation = useNavigation();

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
      // update existing view
      await viewConnector.UpdateView(viewId, state.view);

      // refresh store (to update the view in the navigation)
      await routerManager.ForceInitialize();
    } else {
      // create new view
      const newView = await viewConnector.CreateView(state.view);

      // refresh store (to update the view in the navigation)
      await routerManager.ForceInitialize();

      // push user to the new view
      navigation.navigateTo(navigation.currentNavigationItem.value, newView.id);
    }
  }

  let onDelete: ((event: Event) => Promise<void>) | undefined = undefined;
  if (viewId > 0) {
    onDelete = async () => {
      if (viewId > 0) {
        await viewConnector.DeleteView(viewId);

        // refresh store (to update the view in the navigation)
        await routerManager.ForceInitialize();
      }
    };
  }
  console.log(viewId);
</script>

<template>
  <MkForm title="View" :on-save="onSave" :on-undo="loadView" :on-delete="onDelete">
    <v-text-field label="Name" v-model="state.view.name"></v-text-field>
    <v-text-field label="External Id" v-model="state.view.externalId"></v-text-field>
    <v-text-field label="Component key" v-model="state.view.componentKey"></v-text-field>
    <v-select label="Section" v-model="state.view.sectionId" :items="store.sections" item-title="name" item-value="id"></v-select>
    <v-select label="Roles" v-model="state.view.roles" chips multiple :items="store.roles" item-title="id" item-value="id"></v-select>
  </MkForm>
</template>
