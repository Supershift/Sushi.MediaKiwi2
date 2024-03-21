<script setup lang="ts">
  import { reactive, ref, watch } from "vue";
  import { MkSideSheet } from "@/components";
  import type { ICustomer } from "./../models/Customer";
  // import { SampleDataService } from "./SampleDataService";

  let toggle = ref(false);

  // props for the data we are receiving
  const props = defineProps({
    customer: {
      type: Object as () => ICustomer,
      default: null,
    },
  });

  // Close function for the side sheet
  const close = () => {
    toggle.value = false;
  };

  let implement = props.customer ?? <ICustomer>{};

  let state = reactive({
    data: implement ?? <ICustomer>{},
    images: [],
    roles: ["Can view", "Can edit", "Admin"],
  });
  // // TODO: implement the save and delete functions
  // async function onSaveAsync(): Promise<void> {
  //   return await SampleDataService.SaveAsync(state.data);
  // }

  // function onUndo() {
  //   implement = props.customer ?? <ICustomer>{};
  //   state.data = implement ?? <ICustomer>{};
  // }

  // async function onDeleteAsync(event: Event): Promise<void> {
  //   return await SampleDataService.DeleteAsync(state.data.id);
  // }

  const countries = [
    { title: "Nederland", value: "NL" },
    { title: "België", value: "BE" },
  ];

  watch(
    () => props.customer,
    (newValue) => {
      if (newValue) {
        toggle.value = true;
        state.data = newValue;
      }
    }
  );
</script>
<template>
  <!-- Side sheet demo  -->
  <mk-side-sheet :model-value="toggle" :close-button="true" @closed-sheet="close">
    <template #title> Personal details </template>
    <template #subtitle>
      {{ props.customer.name ?? "[Name]" }} is a customer since {{ props.customer.date.toDateString() }} and lives in
      {{ props.customer.countryName ?? "[Country]" }} ({{ props.customer.countryCode ?? "[Code]" }}) with id {{ props.customer.id ?? "[Id]" }} and has 1 rooms
      reserved.
    </template>
    <template #default>
      <v-card class="mx-auto my-12">
        <v-img
          cover
          height="250"
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
        ></v-img>
        <v-card-subtitle class="d-flex justify-end">{{ state.data.date.toDateString() }}</v-card-subtitle>
        <v-card-text class="pb-5">
          <v-row align="center">
            <v-col cols="6">
              <strong>Identifier: </strong><label for="id"> {{ state.data.id }}</label>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col>
              <v-text-field v-model="state.data.name" label="Name"></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col>
              <v-text-field v-model="state.data.name" label="Email"></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col>
              <v-date-picker v-model="state.data.date" label="Birthdate"></v-date-picker>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col>
              <v-file-input v-model="state.images" label="Profile image"></v-file-input>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col>
              <v-select v-model="state.roles" :items="state.roles" label="Roles" chips multiple></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select v-model:model-value="state.data.countryName" label="Country Code" :items="countries"></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <template #footer>
      <v-btn class="d-inline-block" variant="tonal" color="primary">Save</v-btn>
      <v-btn class="d-inline-block" variant="text" @click="close">Close</v-btn>
    </template>
  </mk-side-sheet>
</template>
