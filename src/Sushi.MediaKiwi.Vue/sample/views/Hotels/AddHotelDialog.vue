<script setup lang="ts">
  import MkFormDialog from "@/components/MkForm/MkFormDialog.vue";
  import { useValidationRules } from "@/composables";
  import { HotelDto } from "@sample/models/HotelDto";
  import { CountryConnector } from "@sample/services/CountryConnector";
  import { HotelConnector } from "@sample/services/HotelConnector";
  import { container } from "tsyringe";
  import { reactive } from "vue";

  const connector = container.resolve(HotelConnector);
  const countriesConnector = container.resolve(CountryConnector);
  const { required } = await useValidationRules();

  // Load countries
  const countries = (await countriesConnector.GetAll({ pageIndex: 0, pageSize: 9999 })).result;

  const state = reactive({
    dialog: false,
    hotel: <HotelDto>{
      isActive: true,
    },
  });

  async function onSave() {
    const result = await connector.SaveAsync({ ...state.hotel });
  }
</script>
<template>
  <MkFormDialog title="Add Hotel" @submit="onSave">
    <v-text-field v-model="state.hotel.name" :rules="[required]"></v-text-field>
    <v-autocomplete v-model="state.hotel.countryCode" :items="countries" :rules="[required]" item-title="name" item-value="code" />
  </MkFormDialog>
</template>
