<script setup lang="ts">
  import { useI18next } from "@/composables/useI18next";
  import { ref } from "vue";
  import { Locale } from "@/models";
  import { onMounted } from "vue";
  import { useLocale } from "vuetify";
  import { useMediaKiwiApi } from "@/services";

  // inject dependencies
  const { i18next } = await useI18next();
  const mediaKiwiApi = useMediaKiwiApi();
  const { current } = useLocale();

  // define reactive variables
  const locales = ref<Locale[]>([]);

  // define events
  async function changeLanguage(value: string) {
    await i18next.value.changeLanguage(value);

    // Update Vuetify locale
    current.value = i18next.value.language;
  }

  // load languages from server
  onMounted(async () => {
    const response = await mediaKiwiApi.localesEnabled();
    locales.value = response.data.result?.map((t) => ({ ...t, id: t.id ?? "" })) ?? [];
  });
</script>

<template>
  <v-select
    label="Language"
    item-title="name"
    item-value="id"
    :model-value="i18next.resolvedLanguage"
    :items="locales"
    hide-details
    @update:model-value="changeLanguage"
  ></v-select>
</template>
