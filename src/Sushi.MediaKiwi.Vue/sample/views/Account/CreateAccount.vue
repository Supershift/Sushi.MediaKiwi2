<script setup lang="ts">
  import { MkForm } from "@/components";
  import { reactive } from "vue";
  import { AccountConnector } from "@sample/services/AccountConnector";
  import { container } from "tsyringe";
  import { ProblemDetails } from "@/models/errors/ProblemDetails";
  import { CreateAccountRequest } from "@sample/models/Account/CreateAccountRequest";

  const connector = container.resolve(AccountConnector);

  const state = reactive({
    isValid: false,
    account: <CreateAccountRequest>{
      number: <string | undefined>undefined,
      holderName: <string | undefined>undefined,
    },
    isSuccessful: false,
    errorReason: <ProblemDetails | undefined>undefined,
  });

  async function onSave() {
    if (state.isValid) {
      try {
        const candidate = await connector.CreateAccountAsync(state.account!);
        state.account = candidate!;
        if (state.account.number) {
          state.isSuccessful = true;
        }
      } catch (e: ProblemDetails | any) {
        console.log(e);

        state.errorReason = e;
      }
    }
  }
</script>
<template>
  <MkForm v-if="!state.isSuccessful" v-model:is-Valid="state.isValid" v-model:error="state.errorReason" title="New Account" show-problem-details-detail-field>
    <template #toolbar>
      <v-btn @click="onSave" color="primary"> Create Account </v-btn>
    </template>
    <v-text-field label="Account Number" v-model="state.account.number" :rules="[(v: any) => !!v || 'Required']" />
    <v-text-field label="Holder Name" v-model="state.account.holderName" :rules="[(v: any) => !!v || 'Required']" />
  </MkForm>
  <v-sheet v-else>
    <v-alert type="success">Account created successfully!</v-alert>
  </v-sheet>
</template>
