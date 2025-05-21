<script setup lang="ts">
  import { MkApplication } from "@/components";
  import { useDisplay } from "vuetify";
  import { useSectionRules } from "./home/composables/useSectionRules";

  // Inject Dependencies
  const { xs } = useDisplay();
  const { setHotelSectionDisplayState } = useSectionRules();

  // Force the hotel section to be disabled and the customer section to be hidden
  setHotelSectionDisplayState("disabled");
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
      <v-toolbar-title v-if="!xs"> MediaKiwi 2 - Sample website</v-toolbar-title>
    </template>
  </mk-application>
</template>

<style lang="scss">
  /* This css layout is conditionally set by providing a CustomLayout to the NavigationProvider entry. 
  The class will be added to the MKScreen component. */
  .custom-css-layout {
    max-width: 1280px;
  }
</style>
