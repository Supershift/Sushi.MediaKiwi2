<script setup lang="ts">
  import { computed, reactive, ref, watch } from "vue";
  import { container } from "tsyringe";
  import { CustomerConnector } from "@sample/customers/connectors/CustomerConnector";
  import MkFormSideSheet from "@/components/MkForm/MkFormSideSheet.vue";
  import { Customer } from "@sample/customers/models/Customer";

  const customerConnector = container.resolve(CustomerConnector);

  /** Model to open the dialog */
  const modelValue = defineModel<boolean>("modelValue", { required: false, default: false });

  const subtitle = computed(() => {
    if (!state.data) return "";

    return `${state.data?.name ?? "[Name]"} is a customer since ${state.data?.date.toDateString()} and lives in ${state.data?.countryName ?? "[Country]"} (${
      state.data?.countryCode ?? "[Code]"
    }) with id ${state.data?.id ?? "[Id]"} and has 1 rooms reserved.`;
  });

  // props for the data we are receiving
  const props = defineProps<{
    customerId: number;
  }>();

  // Close function for the side sheet
  const close = () => {
    modelValue.value = false;
  };

  let state = reactive({
    data: <Customer | undefined>undefined,
    images: [],
    roles: ["Can view", "Can edit", "Admin"],
  });

  const countries = [
    { title: "Nederland", value: "NL" },
    { title: "België", value: "BE" },
  ];

  // watch(
  //   () => props.customer,
  //   (newValue) => {
  //     if (newValue) {
  //       toggle.value = true;
  //       props.customer = newValue;
  //     }
  //   }
  // );

  async function loadData() {
    // get the data, using the sorting option
    const result = await customerConnector.Get(props.customerId);
    state.data = result;
  }
</script>
<template>
  <!-- Side sheet demo  -->
  <MkFormSideSheet v-model="modelValue" title="Personal details" :subtitle="subtitle" @load="loadData" v-model:identifier="props.customerId">
    <v-card class="mx-auto my-12">
      <v-img
        cover
        height="250"
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
      ></v-img>
      <v-card-subtitle class="d-flex justify-end">{{ state.data?.date.toDateString() }}</v-card-subtitle>
      <v-card-text class="pb-5" v-if="state.data">
        <v-row align="center">
          <v-col cols="6">
            <strong>Identifier: </strong><label for="id"> {{ state.data?.id }}</label>
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
    <template #actions>
      <v-btn class="d-inline-block" variant="tonal" color="primary">Save</v-btn>
      <v-btn class="d-inline-block" variant="text" @click="close">Close</v-btn>
    </template>
  </MkFormSideSheet>
</template>
