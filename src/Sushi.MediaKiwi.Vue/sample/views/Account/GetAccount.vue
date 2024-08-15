<script setup lang="ts">
  import { MkForm } from "@/components";
  import { Account } from "@sample/models/Account/Account";
  import { AccountConnector } from "@sample/services/AccountConnector";
  import { container } from "tsyringe";
  import { reactive } from "vue";
  import { useValidationRules } from "@/composables";
  import CreateAccountDialog from "./partials/CreateAccountDialog.vue";
  import AccountDetailsSheet from "./partials/AccountDetailsSheet.vue";

  const accountConnector = container.resolve(AccountConnector);
  const { required } = useValidationRules();

  const state = reactive({
    accountNumber: <string | undefined>undefined,
    account: <Account | undefined>undefined,
    createAccountDialog: false,
    accountDetailsSheet: false,
  });

  async function onGet() {
    state.account = await accountConnector.GetAccountAsync(state.accountNumber!)!;
    if (state.account) {
      state.accountDetailsSheet = true;
    }
  }

  function openCreateAccountDialog() {
    state.createAccountDialog = true;
  }
</script>

<template>
  <MkForm @submit="onGet" submit-button-label="Show Account" hide-submit-snackbar>
    <template #toolbar>
      <v-btn @click="openCreateAccountDialog()">Create Account</v-btn>
    </template>

    <v-text-field label="Account Number" v-model="state.accountNumber" :rules="[required]" />
  </MkForm>

  <CreateAccountDialog v-model="state.createAccountDialog" />
  <AccountDetailsSheet v-if="state.account" v-model="state.accountDetailsSheet" :account="state.account" />
</template>
