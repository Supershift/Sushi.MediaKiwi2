<script setup lang="ts">
  import { useI18next, useNavigation } from "@/composables";
  import { Locale } from "@/models";
  import { ref } from "vue";
  import { MkForm } from "@/components";
  import Translations from "./components/Translations.vue";
  import { useMediaKiwiApi } from "@/services";

  // inject dependencies
  const navigation = useNavigation();
  const { defaultT } = await useI18next();
  const mediaKiwiApi = useMediaKiwiApi();

  // get id of the view from the route
  const localeId = navigation.currentViewParameter;

  // declare reactive variables
  const locale = ref<Locale>({ id: localeId.value ?? "", name: "", isEnabled: false });

  async function onLoad() {
    if (localeId.value) {
      // get existing locale from api
      const candidate = await mediaKiwiApi.localesGet(localeId.value);
      if (!candidate?.data) {
        alert("No locale found!");
      } else {
        locale.value = { ...candidate.data, id: candidate.data.id ?? "" };
      }
    }
  }

  async function onSave() {
    if (localeId.value) {
      // update existing locale
      await mediaKiwiApi.localesUpdate(localeId.value, locale.value);
    } else {
      // create new locale
      const newView = await mediaKiwiApi.localesCreate(locale.value.id, locale.value);

      // push user to the new view
      navigation.navigateTo(navigation.currentNavigationItem.value, newView.data.id);
    }
  }

  let onDelete: ((event?: Event) => Promise<void>) | undefined = undefined;
  if (localeId.value) {
    onDelete = async () => {
      if (localeId.value) {
        await mediaKiwiApi.localesDelete(localeId.value);
      }
    };
  }
</script>
<template>
  <mk-form :on-load="onLoad" :onSubmit="onSave" :on-delete="onDelete">
    <v-text-field v-model="locale.id" label="Id" hint="Unique human-readable id for the locale." :disabled="localeId ? true : false"></v-text-field>
    <v-text-field v-model="locale.name" :label="defaultT('Name')"></v-text-field>
    <v-checkbox v-model="locale.isEnabled" :label="defaultT('IsEnabled')"></v-checkbox>
  </mk-form>

  <translations :locale-id="locale.id"></translations>
</template>
