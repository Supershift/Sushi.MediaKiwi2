<script setup lang="ts">
  import { MkForm } from "@/components";
  import { Account } from "@sample/models/Account/Account";
  import { AccountConnector } from "@sample/services/AccountConnector";
  import { container } from "tsyringe";
  import { reactive } from "vue";
  import { useValidationRules } from "@/composables";
  import CreateAccountDialog from "./partials/CreateAccountDialog.vue";
  import AccountDetailsSheet from "./partials/AccountDetailsSheet.vue";

  const connector = container.resolve(AccountConnector);
  const { required } = useValidationRules();

  const state = reactive({
    accountNumber: <string | undefined>"1",
    account: <Account | undefined>undefined,
    createAccountDialog: false,
    accountDetailsSheet: false,
  });

  async function onGet() {
    state.account = await connector.GetAccountAsync(state.accountNumber!)!;
    if (state.account) {
      state.accountDetailsSheet = true;
    }
  }
</script>

<template>
  <MkForm @submit="onGet" submit-button-label="Show Account" submit-successful-snackbar-message="Account was found!">
    <template #toolbar>
      <v-btn @click="state.createAccountDialog = true">Create Account</v-btn>
    </template>

    <v-text-field label="Account Number" v-model="state.accountNumber" :rules="[required]" />
  </MkForm>

  <CreateAccountDialog v-model="state.createAccountDialog" />
  <AccountDetailsSheet v-model="state.accountDetailsSheet" v-if="state.account" :account="state.account" />
</template>
