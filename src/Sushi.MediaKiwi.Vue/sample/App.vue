<script setup lang="ts">
  import { MkApplication } from "@/components";
  import { useDisplay } from "vuetify";
  import { useSections } from "@/composables";
  import { useSectionRules } from "./composables/useSectionRules";

  // Inject Dependencies
  const { xs } = useDisplay();

  const { addDisableSectionRule } = useSections();
  const { HasAvailableHotels } = useSectionRules();

  // Add rule to disable section if no hotels are available
  addDisableSectionRule(["3"], HasAvailableHotels, "No hotels available. Please add a hotel to enable this section.");
</script>

<template>
  <mk-application>
    <template #logo>
      <picture>
        <source srcset="./assets/logo128.webp" media="(min-width: 600px)" />
        <source srcset="./assets/logoClassic.png" />
        <img src="./assets/logo128.webp" alt="Logo" />
      </picture>
    </template>
    <template #title>
      <v-toolbar-title v-if="!xs">MediaKiwi 2.0 - SampleWeb</v-toolbar-title>
    </template>
  </mk-application>
</template>
