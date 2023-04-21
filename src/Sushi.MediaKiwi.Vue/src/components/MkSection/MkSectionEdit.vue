<script setup lang="ts">
  import { MkForm } from "@/components";
  import { reactive, computed } from "vue";
  import { useRoute } from "@/router";
  import { container } from "tsyringe";
  import { ISectionConnector } from "@/services";
  import { Section } from "@/models";
  import { RouterManager } from "@/router/routerManager";
  import { useNavigation } from "@/composables/useNavigation";
  import { adminSectionId } from "@/constants";

  // inject dependencies
  const SectionConnector = container.resolve<ISectionConnector>("ISectionConnector");
  const routerManager = container.resolve<RouterManager>("RouterManager");

  const route = useRoute();
  const navigation = useNavigation();

  // get id of the section from the route
  const sectionId = navigation.currentViewParameterNumber;

  // Section Id should always have the same Id.
  const isAdminSection = computed(() => state.section.id === adminSectionId);

  // get data object from API
  const state = reactive({
    section: {} as Section,
  });

  async function onLoad() {
    if (sectionId.value > 0) {
      const candidate = await SectionConnector.GetSection(sectionId.value);
      if (!candidate) {
        alert("No section found!");
      }
      state.section = candidate!;
    } else {
      state.section = { id: 0, name: "", sortOrder: 0 };
    }
  }

  let onSave: ((event: Event) => Promise<void>) | undefined = undefined;
  if (sectionId.value !== adminSectionId) {
    onSave = async () => {
      if (sectionId.value > 0) {
        // update existing section
        await SectionConnector.UpdateSection(sectionId.value, state.section);

        // refresh store (to update the section in the navigation)
        await routerManager.ForceInitialize();
      } else {
        // create new section
        const newSection = await SectionConnector.CreateSection(state.section);

        // refresh store (to update the section in the navigation)
        await routerManager.ForceInitialize();

        // push user to the new section
        navigation.navigateTo(navigation.currentNavigationItem.value, newSection.id);
      }
    };
  }

  let onDelete: ((event: Event) => Promise<void>) | undefined = undefined;
  if (sectionId.value > adminSectionId) {
    onDelete = async () => {
      if (sectionId.value > 0) {
        await SectionConnector.DeleteSection(sectionId.value);

        // refresh store (to update the section in the navigation)
        await routerManager.ForceInitialize();
      }
    };
  }
</script>

<template>
  <v-alert v-if="isAdminSection" icon="mdi-information-outline" color="info" text="You cannot edit the Admin section" class="my-2"></v-alert>

  <MkForm title="Section" :on-save="onSave" :on-load="onLoad" :on-delete="onDelete">
    <v-text-field v-model="state.section.name" label="Name" :disabled="isAdminSection"></v-text-field>
    <v-text-field v-model="state.section.icon" label="Icon" :disabled="isAdminSection" placeholder="mdi-home"></v-text-field>
    <v-text-field v-model="state.section.sortOrder" label="Sort order" type="number" :disabled="isAdminSection"></v-text-field>
  </MkForm>
</template>
