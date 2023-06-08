<script setup lang="ts">
  import { useI18next, useNavigation } from "@/composables";
  import { Locale } from "@/models";
  import { ILocaleConnector } from "@/services";
  import { container } from "tsyringe";
  import { ref } from "vue";
  import { MkForm } from "@/components";

  // inject dependencies
  const localeConnector = container.resolve<ILocaleConnector>("ILocaleConnector");
  const navigation = useNavigation();
  const { t, defaultT } = await useI18next();

  // get id of the view from the route
  const localeId = navigation.currentViewParameter;

  // declare reactive variables
  const locale = ref<Locale>({ id: localeId.value ?? "", isEnabled: false });

  async function onLoad() {
    if (localeId.value) {
      // get existing locale from api
      const candidate = await localeConnector.Get(localeId.value);
      if (!candidate) {
        alert("No locale found!");
      } else {
        locale.value = candidate;
      }
    }
  }

  async function onSave() {
    if (localeId.value) {
      // update existing locale
      await localeConnector.Update(localeId.value, locale.value);
    } else {
      // create new locale
      const newView = await localeConnector.Create(locale.value.id, locale.value);

      // push user to the new view
      navigation.navigateTo(navigation.currentNavigationItem.value, newView.id);
    }
  }

  let onDelete: ((event: Event) => Promise<void>) | undefined = undefined;
  if (localeId.value) {
    onDelete = async () => {
      if (localeId.value) {
        await localeConnector.Delete(localeId.value);
      }
    };
  }
</script>
<template>
  <mk-form :on-load="onLoad" :on-save="onSave" :on-delete="onDelete">
    <v-text-field v-model="locale.id" label="Id" hint="Unique human-readable id for the locale." :disabled="localeId ? true : false"></v-text-field>
    <v-text-field v-model="locale.name" :label="defaultT('Name')"></v-text-field>
    <v-checkbox v-model="locale.isEnabled" :label="defaultT('IsEnabled')"></v-checkbox>
  </mk-form>
</template>
