<script setup lang="ts">
  import MkForm from "@/components/MkForm/MkForm.vue";
  import { useBreadcrumbs, useNavigation, useValidationRules } from "@/composables";
  import { Api, Country } from "@sample/services";
  import { container } from "tsyringe";
  import { computed, reactive } from "vue";

  // Inject dependencies
  const { sample: sampleApi } = container.resolve<Api<any>>("SampleApi");
  const navigation = useNavigation();
  const countryCode = computed(() => navigation.currentRouteParamId.value?.toString());
  const { required } = await useValidationRules();
  const { setCurrentBreadcrumbLabel } = useBreadcrumbs();

  const state = reactive({
    country: <Country>{},
  });

  async function load() {
    state.country = (await sampleApi.countriesGet(countryCode.value!)).data;
    setCurrentBreadcrumbLabel(state.country.name);
  }

  async function save() {
    throw new Error("Not implemented");
  }
</script>
<template>
  <MkForm @load="load" @submit="save">
    <v-text-field v-model="state.country.code" label="Code" required :rules="[required]"></v-text-field>
    <v-text-field v-model="state.country.name" label="Name" required :rules="[required]"></v-text-field>
  </MkForm>
</template>
