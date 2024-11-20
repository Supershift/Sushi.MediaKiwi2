<script setup lang="ts">
  import { MkForm } from "@/components";
  import { useMediaKiwiApi } from "@/services";
  import { MediakiwiVueOptions, NavigationItemDto, ViewDto } from "@/models";
  import { useMediakiwiStore } from "@/stores";
  import { RouterManager } from "@/router/routerManager";
  import { useNavigation, useValidationRules } from "@/composables";
  import { inject, reactive } from "vue";
  import { noPageSize } from "@/constants";

  // inject dependencies
  const routerManager = inject<RouterManager>("RouterManager");
  const { required } = await useValidationRules();

  const store = useMediakiwiStore();
  const navigation = useNavigation();
  const { alphaNumericNoSpace } = await useValidationRules();
  const mediaKiwiApi = useMediaKiwiApi();

  // get id of the view from the route
  const navigationItemId = navigation.currentViewParameter;

  const state = reactive({
    navigationItem: <NavigationItemDto>{},
    allNavigationItems: <NavigationItemDto[]>[],
    views: <ViewDto[]>[],
  });

  async function onLoad() {
    if (navigationItemId.value) {
      // get existing item from api
      const candidate = await mediaKiwiApi.navigationitemsGet(navigationItemId.value);
      state.navigationItem = candidate.data;
    }
  }

  async function onSave() {
    if (navigationItemId.value) {
      // update existing view
      await mediaKiwiApi.navigationitemsUpdate(state.navigationItem.id, state.navigationItem);

      // refresh store (to update the view in the navigation)
      await routerManager?.ForceInitialize();
    } else {
      // create new view
      const newNavigationItem = await mediaKiwiApi.navigationitemsCreate(state.navigationItem.id, state.navigationItem);

      // refresh store (to update the view in the navigation)
      await routerManager?.ForceInitialize();

      // push user to the new view
      navigation.navigateTo(navigation.currentNavigationItem.value, newNavigationItem.data.id);
    }
  }

  let onDelete: ((event?: Event) => Promise<void>) | undefined = undefined;
  if (navigationItemId.value) {
    onDelete = async () => {
      if (navigationItemId.value) {
        await mediaKiwiApi.navigationitemsDelete(state.navigationItem.id);

        // refresh store (to update the view in the navigation)
        await routerManager?.ForceInitialize();
      }
    };
  }

  // load options
  const navigationItems = await mediaKiwiApi.navigationitems({ pageSize: noPageSize });
  const views = (await mediaKiwiApi.views({ pageSize: noPageSize })).data;

  state.allNavigationItems = navigationItems.data.result;
  state.views = views.result;
</script>

<template>
  <MkForm title="" :onSubmit="onSave" :on-load="onLoad" :on-delete="onDelete">
    <v-text-field
      v-model="state.navigationItem.id"
      label="Id"
      :disabled="navigationItemId ? true : false"
      :rules="[required, alphaNumericNoSpace]"
    ></v-text-field>
    <v-text-field v-model="state.navigationItem.name" label="Name" :rules="[required]"></v-text-field>
    <v-autocomplete
      v-model="state.navigationItem.parentNavigationItemId"
      label="Parent"
      :items="state.allNavigationItems"
      item-title="name"
      item-value="id"
    ></v-autocomplete>
    <v-select
      v-model="state.navigationItem.sectionId"
      label="Section"
      :items="store.navigationTree.sections"
      item-title="name"
      item-value="id"
      :rules="[(v: string) => !!v]"
    ></v-select>
    <v-autocomplete
      v-model="state.navigationItem.viewId"
      label="View"
      :items="state.views"
      item-title="name"
      item-value="id"
      :rules="[(v: string|undefined) => !!v]"
    ></v-autocomplete>
    <v-text-field v-model="state.navigationItem.icon" label="Icon"></v-text-field>
    <v-text-field v-model="state.navigationItem.sortOrder" label="SortOrder" type="number"></v-text-field>
  </MkForm>
</template>
