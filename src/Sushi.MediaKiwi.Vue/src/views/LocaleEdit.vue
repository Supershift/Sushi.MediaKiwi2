<script setup lang="ts">
  import { useBreadcrumbs, useI18next, useNavigation, useValidationRules } from "@/composables";
  import { Locale } from "@/models";
  import { ILocaleConnector } from "@/services";
  import { container } from "tsyringe";
  import { ref } from "vue";
  import { MkForm, MkDialogCard } from "@/components";
  import Translations from "./components/Translations.vue";

  // inject dependencies
  const localeConnector = container.resolve<ILocaleConnector>("ILocaleConnector");
  const navigation = useNavigation();
  const { defaultT, t } = await useI18next();
  const { setCurrentBreadcrumbLabel } = useBreadcrumbs();
  const { required, maxLength } = await useValidationRules();

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
        if (locale.value.name) {
          setCurrentBreadcrumbLabel(locale.value.name);
        }
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

  let onDelete: ((event?: Event) => Promise<void>) | undefined = undefined;
  if (localeId.value) {
    onDelete = async () => {
      if (localeId.value) {
        await localeConnector.Delete(localeId.value);
      }
    };
  }
</script>
<template>
  <mk-form @load="onLoad" @submit="onSave" @delete="onDelete">
    <v-text-field
      v-model="locale.id"
      :label="defaultT('Id')"
      :hint="t('LocaleIdHint', 'Unique human-readable id for the locale.')"
      :disabled="localeId ? true : false"
      :rules="[required, maxLength(5)]"
    ></v-text-field>
    <v-text-field v-model="locale.name" :label="defaultT('Name')" :rules="[required, maxLength(128)]"></v-text-field>
    <v-checkbox v-model="locale.isEnabled" :label="defaultT('Enabled')"></v-checkbox>
  </mk-form>

  <translations v-if="locale.id" :locale-id="locale.id"></translations>
</template>
