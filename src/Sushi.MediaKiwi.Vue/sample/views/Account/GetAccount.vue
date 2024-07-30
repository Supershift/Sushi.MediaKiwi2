<script setup lang="ts">
  import { MkForm } from "@/components";
  import { Account } from "@sample/models/Account/Account";
  import { AccountConnector } from "@sample/services/AccountConnector";
  import { container } from "tsyringe";
  import { reactive } from "vue";
  import { useNavigation } from "@/composables/useNavigation";

  const connector = container.resolve(AccountConnector);
  const { navigateToView } = useNavigation();

  const state = reactive({
    accountNumber: <string | undefined>"223",
    account: <Account | undefined>undefined,
  });

  async function onGet() {
    state.account = await connector.GetAccountAsync(state.accountNumber!)!;
  }

  function navigateToAccount() {
    console.log(state.account?.number);

    if (state.account) {
      navigateToView("EditAccount", state.account.number);
    }
  }
</script>

<template>
  <MkForm title="Search Account" :on-load="onGet" show-problem-details-detail-field>
    <template #toolbar>
      <v-btn @click="onGet"> Search Account </v-btn>
    </template>
    <v-text-field label="Account Number" v-model="state.accountNumber" :rules="[(v: any) => !!v || 'Account number is required']" />

    <v-card v-if="state.account">
      <v-card-title class="mb-4">Account Information</v-card-title>
      <v-text-field label="Holder Name" v-model="state.account.holderName" readonly />
      <v-text-field label="Balance" v-model="state.account.balance" readonly />
      <v-btn @click="navigateToAccount()"> Go to account </v-btn>
    </v-card>
  </MkForm>
</template>
