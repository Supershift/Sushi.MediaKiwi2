<script setup lang="ts">
  import SampleSideSheet from "./../components/SampleSideSheet.vue";
  import SampleTable3 from "../components/SampleTable3.vue";

  import { ref } from "vue";
  import { ICustomer } from "./../models/Customer";

  let refData = ref<ICustomer>({
    id: 1,
    name: "Jane Doe",
    countryCode: "NL",
    countryName: "Nederland",
    date: new Date("2021-01-01"),
  });

  function clickedCustomer(event: ICustomer) {
    refData.value = event;
  }
</script>

<template>
  <v-lazy :options="{ threshold: 0.5 }" transition="fade-transition">
    <v-card>
      <SampleTable3 @clicked:customer="clickedCustomer"></SampleTable3>
    </v-card>
  </v-lazy>
  <SampleSideSheet :customer="refData"></SampleSideSheet>
</template>
