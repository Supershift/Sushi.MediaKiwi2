<script setup lang="ts">
  import { MkForm } from "@/components";
  import { Account } from "@sample/models/Account/Account";
  import { AccountConnector } from "@sample/services/AccountConnector";
  import { container } from "tsyringe";
  import { reactive } from "vue";
  import { useNavigation, useValidationRules } from "@/composables";
  import CreateAccountDialog from "./partials/CreateAccountDialog.vue";

  const accountConnector = container.resolve(AccountConnector);
  const { required } = useValidationRules();
  const navigation = useNavigation();

  const state = reactive({
    accountNumber: <string | undefined>undefined,
    account: <Account | undefined>undefined,
    createAccountDialog: false,
    accountDetailsSheet: false,
  });

  async function onGet() {
    state.account = await accountConnector.GetAccountAsync(state.accountNumber!)!;
    if (state.account) {
      navigation.navigateToView("EditAccount", state.account.number);
    }
  }

  function openCreateAccountDialog() {
    state.createAccountDialog = true;
  }
</script>

<template>
  <MkForm @submit="onGet" hide-submit-snackbar>
    <template #toolbar>
      <v-btn @click="openCreateAccountDialog()">Create Account</v-btn>
    </template>

    <v-text-field label="Account Number" v-model="state.accountNumber" :rules="[required]" />
  </MkForm>

  <CreateAccountDialog v-model="state.createAccountDialog" />
</template>
