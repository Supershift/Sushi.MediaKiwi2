<script setup lang="ts">
  import { MkForm } from "@/components";
  import { reactive, computed } from "vue";
  import { container } from "tsyringe";
  import { Api } from "@/services";
  import { SectionDto, IconsLibrary } from "@/models";
  import { RouterManager } from "@/router/routerManager";
  import { useNavigation, useValidationRules } from "@/composables";
  import { adminSectionId } from "@/constants";
  import { useMediakiwiStore } from "@/stores";

  // inject dependencies
  const { mediakiwi: mediaKiwiApi } = container.resolve<Api<any>>("MediaKiwiApi");
  const routerManager = container.resolve<RouterManager>("RouterManager");

  const store = useMediakiwiStore();
  const navigation = useNavigation();
  const { alphaNumericNoSpace } = await useValidationRules();

  // get id of the section from the route
  const sectionId = navigation.currentViewParameter;

  // Section Id should always have the same Id.
  const isAdminSection = computed(() => state.section.id === adminSectionId);

  // get data object from API
  const state = reactive({
    section: {} as SectionDto,
  });

  async function onLoad() {
    if (sectionId.value) {
      const candidate = (await mediaKiwiApi.sectionsGet(sectionId.value)).data;
      if (!candidate) {
        alert("No section found!");
      }
      state.section = candidate!;
    } else {
      state.section = { id: "", name: "", sortOrder: 0, roles: [] };
    }
  }

  async function onSave(): Promise<void> {
    if (sectionId.value !== adminSectionId) {
      if (sectionId.value) {
        // update existing section
        await mediaKiwiApi.sectionsUpdate(sectionId.value, state.section);

        // refresh store (to update the section in the navigation)
        await routerManager.ForceInitialize();
      } else {
        // create new section
        const newSection = await mediaKiwiApi.sectionsCreate(state.section.id, state.section);

        // refresh store (to update the section in the navigation)
        await routerManager.ForceInitialize();

        // push user to the new section
        navigation.navigateTo(navigation.currentNavigationItem.value, newSection.data.id);
      }
    }
  }

  async function onDelete(): Promise<void> {
    if (sectionId.value !== adminSectionId) {
      if (sectionId.value) {
        await mediaKiwiApi.sectionsDelete(sectionId.value);

        // refresh store (to update the section in the navigation)
        await routerManager.ForceInitialize();
      }
    }
  }
</script>

<template>
  <v-alert v-if="isAdminSection" :icon="IconsLibrary.informationOutline" color="info" text="You cannot edit the Admin section" class="my-2"></v-alert>

  <MkForm title="Section" :onSubmit="onSave" :on-load="onLoad" :on-delete="onDelete">
    <v-text-field v-model="state.section.id" label="Id" :disabled="sectionId ? true : false" :rules="[alphaNumericNoSpace]"></v-text-field>
    <v-text-field v-model="state.section.name" label="Name" :disabled="isAdminSection"></v-text-field>
    <v-text-field v-model="state.section.icon" label="Icon" :disabled="isAdminSection" :placeholder="IconsLibrary.home"></v-text-field>
    <v-text-field v-model="state.section.sortOrder" label="Sort order" type="number" :disabled="isAdminSection"></v-text-field>
    <v-autocomplete
      v-model="state.section.roles"
      label="Roles"
      chips
      multiple
      :items="store.roles"
      item-title="id"
      item-value="id"
      hint="If set, only these roles can see the section. If empty, all roles can see the section."
    ></v-autocomplete>
  </MkForm>
</template>
