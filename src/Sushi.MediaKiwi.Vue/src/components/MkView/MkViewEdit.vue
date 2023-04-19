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

  const store = useMediakiwiStore();
  const navigation = useNavigation();

  // get id of the view from the route
  const viewId = navigation.currentViewParameterNumber;

  // get data object from API
  const state = reactive({
    view: {} as View,
  });

  async function onLoad() {
    if (viewId.value > 0) {
      const candidate = await viewConnector.GetView(viewId.value);
      if (!candidate) {
        alert("No view found!");
      }
      state.view = candidate!;
    } else {
      state.view = { id: 0 };
    }
  }

  async function onSave() {
    if (viewId.value > 0) {
      // update existing view
      await viewConnector.UpdateView(viewId.value, state.view);

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
  if (viewId.value > 0) {
    onDelete = async () => {
      if (viewId.value > 0) {
        await viewConnector.DeleteView(viewId.value);

        // refresh store (to update the view in the navigation)
        await routerManager.ForceInitialize();
      }
    };
  }
</script>

<template>
  <MkForm title="View" :on-save="onSave" :on-load="onLoad" :on-delete="onDelete">
    <v-text-field v-model="state.view.name" label="Name"></v-text-field>
    <v-text-field v-model="state.view.externalId" label="External Id"></v-text-field>
    <v-text-field v-model="state.view.componentKey" label="Component key" hint="The key of the component as set in the modules property of the mediakiwi options."></v-text-field>
    <v-select v-model="state.view.sectionId" label="Section" :items="store.sections" item-title="name" item-value="id"></v-select>
    <v-text-field v-model="state.view.parameterName" label="Parameter" hint="Name of the URL parameter required by this view, e.g. itemId, viewId, etc."></v-text-field>
    <v-select v-model="state.view.roles" label="Roles" chips multiple :items="store.roles" item-title="id" item-value="id"></v-select>
  </MkForm>
</template>
