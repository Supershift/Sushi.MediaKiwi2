<script setup lang="ts">
  import { MkApplication } from "@/components";
  import { useDisplay } from "vuetify";
  import { useSectionRules } from "./composables/useSectionRules";
  import { useFormMessages, useI18next } from "@/composables";
  import { useErrorMessages } from "@/composables/useErrorMessages";
  import { container } from "tsyringe";

  // const useFormMessagesInstance = await useFormMessages();
  // container.register("formMessages", { useValue: useFormMessagesInstance });

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
