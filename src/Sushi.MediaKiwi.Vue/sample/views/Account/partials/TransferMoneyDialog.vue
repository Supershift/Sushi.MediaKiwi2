<script setup lang="ts">
  import { reactive } from "vue";
  import { container } from "tsyringe";
  import { useValidationRules } from "@/composables";
  import MkFormDialog from "@/components/MkForm/MkFormDialog.vue";
  import { Api, TransferMoneyRequest } from "@sample/services";

  const { sample: sampleApi } = container.resolve<Api<any>>("SampleApi");
  const { required } = await useValidationRules();

  const state = reactive({
    form: {
      source: <string | undefined>undefined,
      target: <string | undefined>undefined,
      amount: <number | undefined>undefined,
    },
    isSuccessful: false,
  });

  async function onSubmit() {
    const request = <TransferMoneyRequest>{
      amount: state.form.amount!,
      sourceAccountNumber: state.form.source!,
      targetAccountNumber: state.form.target!,
    };
    await sampleApi.accountTransferMoneyCreate(request);
  }
</script>
<template>
  <MkFormDialog @submit="onSubmit" title="Transfer">
    <v-text-field label="From account number" v-model="state.form.source" :rules="[required]" />
    <v-text-field label="To account number" v-model="state.form.target" :rules="[required]" />
    <v-text-field label="Amount" v-model="state.form.amount" :rules="[required]" type="number" />
  </MkFormDialog>
</template>
