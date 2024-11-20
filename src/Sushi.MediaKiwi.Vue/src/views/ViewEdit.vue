<script setup lang="ts">
  import { MkForm } from "@/components";
  import { ref } from "vue";
  import { container } from "tsyringe";
  import { ViewDto } from "@/models";
  import { useMediakiwiStore } from "@/stores";
  import { RouterManager } from "@/router/routerManager";
  import { useNavigation } from "@/composables/useNavigation";
  import { useValidationRules } from "@/composables";
  import { Api } from "@/services";

  // inject dependencies
  const { mediakiwi: mediaKiwiApi } = container.resolve<Api<any>>("MediaKiwiApi");
  const routerManager = container.resolve<RouterManager>("RouterManager");
  const { required } = await useValidationRules();

  const store = useMediakiwiStore();
  const navigation = useNavigation();

  // get id of the view from the route
  const viewId = navigation.currentViewParameter;

  // declare reactive variables
  const view = ref<ViewDto>({ id: viewId.value ?? "", name: "", componentKey: "", roles: [] });

  async function onLoad() {
    if (viewId.value) {
      // get existing view from api
      const candidate = (await mediaKiwiApi.viewsGet(viewId.value)).data;
      if (!candidate) {
        alert("No view found!");
      }
      view.value = candidate!;
    }
  }

  async function onSave() {
    if (viewId.value) {
      // update existing view
      await mediaKiwiApi.viewsUpdate(viewId.value, view.value);

      // refresh store (to update the view in the navigation)
      await routerManager.ForceInitialize();
    } else {
      // create new view
      const newView = await mediaKiwiApi.viewsCreate(view.value.id, view.value);

      // refresh store (to update the view in the navigation)
      await routerManager.ForceInitialize();

      // push user to the new view
      navigation.navigateTo(navigation.currentNavigationItem.value, newView.data.id);
    }
  }

  let onDelete: ((event?: Event) => Promise<void>) | undefined = undefined;
  if (viewId.value) {
    onDelete = async () => {
      if (viewId.value) {
        await mediaKiwiApi.viewsDelete(viewId.value);

        // refresh store (to update the view in the navigation)
        await routerManager.ForceInitialize();
      }
    };
  }
</script>

<template>
  <MkForm title="View" :onSubmit="onSave" :on-delete="onDelete" @load="onLoad">
    <v-text-field
      v-model="view.id"
      label="Id"
      hint="Unique human-readable id for the view."
      :disabled="viewId ? true : false"
      :rules="[required]"
    ></v-text-field>
    <v-text-field v-model="view.name" label="Name" :rules="[required]"></v-text-field>
    <v-text-field
      v-model="view.componentKey"
      label="Component key"
      hint="The key of the component as set in the modules property of the mediakiwi options."
      :rules="[required]"
    ></v-text-field>
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
