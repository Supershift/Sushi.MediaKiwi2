<script setup lang="ts">
  import { MkForm, MkInputChip } from "@/components";
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

  function removeRole(roleId: string) {
    if (roleId && state.view.roles && state.view.roles.indexOf(roleId) > -1) {
      state.view.roles.splice(state.view.roles?.indexOf(roleId), 1);
    }
  }

  function clickRole() {
    alert("click on the role");
  }
</script>

<template>
  <MkForm title="View">
    <v-text-field v-model="state.view.name" label="Name"></v-text-field>
    <v-text-field v-model="state.view.externalId" label="External Id"></v-text-field>
    <v-text-field v-model="state.view.componentKey" label="Component key"></v-text-field>
    <v-select v-model="state.view.sectionId" label="Section" :items="store.sections" item-title="name" item-value="id"></v-select>
    <v-select v-model="state.view.roles" label="Roles" multiple :items="store.roles" item-title="id" item-value="id">
      <template #selection="{ item }">
        <MkInputChip :item="item" @click="clickRole" @click:remove="removeRole" />
      </template>
    </v-select>
  </MkForm>
</template>
