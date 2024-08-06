<script setup lang="ts">
  import { MkForm } from "@/components";
  import { computed, reactive } from "vue";
  import { AccountConnector } from "@sample/services/AccountConnector";
  import { container } from "tsyringe";
  import { useNavigation } from "@/composables/useNavigation";
  import { Account } from "@sample/models/Account/Account";
  import { ProblemDetails } from "@/models/errors/ProblemDetails";
  import MkConfirmDialog from "@/components/MkConfirmDialog/MkConfirmDialog.vue";
  import { DepositMoneyRequest } from "@sample/models/Account/DepositMoneyRequest";

  const connector = container.resolve(AccountConnector);
  const navigation = useNavigation();

  const state = reactive({
    account: <Account>{},
    problemDetails: <ProblemDetails | undefined>undefined,
  });

  const accountNumber = computed<string>(() => navigation.currentViewParameter.value as string);

  async function onClose() {
    try {
      state.account = await connector.CloseAccountAsync(state.account.number!)!;
    } catch (error: ProblemDetails | any) {
      state.problemDetails = error;
    }
  }

  async function onGet() {
    state.account = await connector.GetAccountAsync(accountNumber.value!)!;
  }

  async function onSubmit() {
    const request = <DepositMoneyRequest>{
      amount: state.account.balance!,
    };
    await connector.DepositAsync(state.account.number!, request);
  }
</script>
<template>
  <MkForm title="Close Account" @load="onGet" @submit="onSubmit" hide-submit-snackbar hide-undo submit-button-label="Deposit">
    <template #overflowIconItems>
      <MkConfirmDialog @confirm="onClose">
        <template #activator="{ props }">
          <v-list-item v-bind="props" color="primary"> Close Account </v-list-item>
        </template>
        <template #default>
          <p>Are you sure you wan't de close this account</p>
        </template>
      </MkConfirmDialog>
    </template>
    <v-text-field readonly label="Account Number" v-model="state.account.number" :rules="[(v: any) => !!v || 'Required']" />
    <v-text-field readonly label="Holder Name" v-model="state.account.holderName" :rules="[(v: any) => !!v || 'Required']" />
    <v-text-field label="Balance" v-model="state.account.balance" />
  </MkForm>
</template>
