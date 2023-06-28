<script setup lang="ts">
  import { MkForm } from "@/components";
  import { ref } from "vue";
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
  const viewId = navigation.currentViewParameter;

  // declare reactive variables
  const view = ref<View>({ id: viewId.value ?? "" });

  async function onLoad() {
    if (viewId.value) {
      // get existing view from api
      const candidate = await viewConnector.GetView(viewId.value);
      if (!candidate) {
        alert("No view found!");
      }
      view.value = candidate!;
    }
  }

  async function onSave() {
    if (viewId.value) {
      // update existing view
      await viewConnector.UpdateView(viewId.value, view.value);

      // refresh store (to update the view in the navigation)
      await routerManager.ForceInitialize();
    } else {
      // create new view
      const newView = await viewConnector.CreateView(view.value.id, view.value);

      // refresh store (to update the view in the navigation)
      await routerManager.ForceInitialize();

      // push user to the new view
      navigation.navigateTo(navigation.currentNavigationItem.value, newView.id);
    }
  }

  let onDelete: ((event: Event) => Promise<void>) | undefined = undefined;
  if (viewId.value) {
    onDelete = async () => {
      if (viewId.value) {
        await viewConnector.DeleteView(viewId.value);

        // refresh store (to update the view in the navigation)
        await routerManager.ForceInitialize();
      }
    };
  }
</script>

<template>
  <MkForm title="View" :on-save="onSave" :on-load="onLoad" :on-delete="onDelete">
    <v-text-field v-model="view.id" label="Id" hint="Unique human-readable id for the view." :disabled="viewId ? true : false"></v-text-field>
    <v-text-field v-model="view.name" label="Name"></v-text-field>
    <v-text-field
      v-model="view.componentKey"
      label="Component key"
      hint="The key of the component as set in the modules property of the mediakiwi options."
    ></v-text-field>
    <v-select v-model="view.sectionId" label="Section" :items="store.sections" item-title="name" item-value="id"></v-select>
    <v-text-field
      v-model="view.parameterName"
      label="Parameter"
      hint="Name of the URL parameter required by this view, e.g. itemId, viewId, etc."
    ></v-text-field>
    <v-select
      v-model="view.roles"
      label="Roles"
      chips
      multiple
      :items="store.roles"
      item-title="id"
      item-value="id"
      hint="If set, only these roles can access the view. If empty, all roles can access the view."
    ></v-select>
  </MkForm>
</template>
