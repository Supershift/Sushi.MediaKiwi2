<script setup lang="ts">
  import { Account } from "@sample/models/Account/Account";
  import MkFormSideSheet from "@/components/MkForm/MkFormSideSheet.vue";
  import { DepositMoneyRequest } from "@sample/models/Account/DepositMoneyRequest";
  import { container } from "tsyringe";
  import { AccountConnector } from "@sample/services/AccountConnector";

  const connector = container.resolve(AccountConnector);

  const modelValue = defineModel<boolean>({ required: true });
  const account = defineModel<Account>("account", { required: true });

  async function onSubmit() {
    const request = <DepositMoneyRequest>{
      amount: account.value!.balance!,
    };
    await connector.DepositAsync(account.value.number!, request);
  }
</script>
<template>
  <MkFormSideSheet v-model="modelValue" title="Account Information" @submit="onSubmit">
    <v-text-field label="Holder Name" v-model="account.holderName" readonly />
    <v-text-field label="Balance" v-model="account.balance" />
  </MkFormSideSheet>
</template>
