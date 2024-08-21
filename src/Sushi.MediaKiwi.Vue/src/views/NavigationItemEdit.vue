<script setup lang="ts">
  import { MkForm } from "@/components";
  import { container } from "tsyringe";
  import { INavigationConnector } from "@/services";
  import { NavigationItem } from "@/models";
  import { useMediakiwiStore } from "@/stores";
  import { RouterManager } from "@/router/routerManager";
  import { useNavigation, useValidationRules } from "@/composables";
  import { computed, reactive } from "vue";

  // inject dependencies
  const navigationConnector = container.resolve<INavigationConnector>("INavigationConnector");
  const routerManager = container.resolve<RouterManager>("RouterManager");

  const store = useMediakiwiStore();
  const navigation = useNavigation();
  const { alphaNumericNoSpace } = useValidationRules();

  // get id of the view from the route
  const navigationItemId = navigation.currentViewParameter;

  const state = reactive({
    navigationItem: <NavigationItem>{},
  });

  const viewOptions = computed(() => store.views);

  async function onLoad() {
    if (navigationItemId.value) {
      // get existing view from api
      const candidate = await navigationConnector.GetNavigationItem(navigationItemId.value);
      state.navigationItem = candidate!;
    }
  }

  async function onSave() {
    if (navigationItemId.value) {
      // update existing view
      await navigationConnector.UpdateNavigationItem(state.navigationItem);

      // refresh store (to update the view in the navigation)
      await routerManager.ForceInitialize();
    } else {
      // create new view
      const newNavigationItem = await navigationConnector.CreateNavigationItem(state.navigationItem);

      // refresh store (to update the view in the navigation)
      await routerManager.ForceInitialize();

      // push user to the new view
      navigation.navigateTo(navigation.currentNavigationItem.value, newNavigationItem.id);
    }
  }

  let onDelete: ((event?: Event) => Promise<void>) | undefined = undefined;
  if (navigationItemId.value) {
    onDelete = async () => {
      if (navigationItemId.value) {
        await navigationConnector.DeleteNavigationItem(state.navigationItem.id);

        // refresh store (to update the view in the navigation)
        await routerManager.ForceInitialize();
      }
    };
  }
</script>

<template>
  <MkForm title="" :onSubmit="onSave" :on-load="onLoad" :on-delete="onDelete">
    <v-text-field v-model="state.navigationItem.id" label="Id" :disabled="navigationItemId ? true : false" :rules="[alphaNumericNoSpace]"></v-text-field>
    <v-text-field v-model="state.navigationItem.name" label="Name" :rules="[(v) => !!v]"></v-text-field>
    <v-autocomplete
      v-model="state.navigationItem.parentNavigationItemId"
      label="Parent"
      :items="store.navigationItems"
      item-title="name"
      item-value="id"
    ></v-autocomplete>
    <v-select
      v-model="state.navigationItem.sectionId"
      label="Section"
      :items="store.sections"
      item-title="name"
      item-value="id"
      :rules="[(v) => !!v]"
    ></v-select>
    <v-autocomplete
      v-model="state.navigationItem.viewId"
      label="View"
      :items="viewOptions"
      item-title="name"
      item-value="id"
      :rules="[(v) => !!v]"
    ></v-autocomplete>
    <v-text-field v-model="state.navigationItem.icon" label="Icon"></v-text-field>
    <v-text-field v-model="state.navigationItem.sortOrder" label="SortOrder" type="number"></v-text-field>
  </MkForm>
</template>
