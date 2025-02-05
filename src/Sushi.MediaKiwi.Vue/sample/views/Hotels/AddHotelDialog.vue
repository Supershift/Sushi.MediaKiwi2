<script setup lang="ts">
  import MkFormDialog from "@/components/MkForm/MkFormDialog.vue";
  import { useValidationRules } from "@/composables";
  import { HotelDto, useSampleApi } from "@sample/services";
  import { reactive } from "vue";

  const sampleApi = useSampleApi();
  const { required } = await useValidationRules();

  const countries = (await sampleApi.countries({ pageIndex: 0, pageSize: 9999 })).data.result;

  const state = reactive({
    dialog: false,
    hotel: <HotelDto>{
      isActive: true,
    },
  });

  async function onSave() {
    await sampleApi.hotelCreate({ ...state.hotel });
  }
</script>
<template>
  <MkFormDialog title="Add Hotel" @submit="onSave">
    <v-text-field v-model="state.hotel.name" :rules="[required]"></v-text-field>
    <v-autocomplete v-model="state.hotel.countryCode" :items="countries" :rules="[required]" item-title="name" item-value="code" />
  </MkFormDialog>
</template>
