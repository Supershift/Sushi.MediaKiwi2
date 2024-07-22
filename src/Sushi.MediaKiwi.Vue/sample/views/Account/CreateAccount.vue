<script setup lang="ts">
  import { MkForm } from "@/components";
  import { Account } from "@sample/models/Account/Account";
  import { AccountConnector } from "@sample/services/AccountConnector";
  import { container } from "tsyringe";
  import { reactive } from "vue";

  const connector = container.resolve(AccountConnector);

  const state = reactive({
    isValid: false,
    accountNumber: <string | undefined>undefined,
    account: <Account | undefined>undefined,
  });

  async function onGet() {
    state.account = await connector.GetAccountAsync(state.accountNumber!);
  }
</script>

<template>
  <MkForm v-model:is-valid="state.isValid" title="Account">
    <template #toolbar>
      <v-btn @click="onGet"> Get Account </v-btn>
    </template>
    <v-text-field label="Number" v-model="state.accountNumber" :rules="[(v: any) => !!v || 'Required']" />
  </MkForm>
</template>
