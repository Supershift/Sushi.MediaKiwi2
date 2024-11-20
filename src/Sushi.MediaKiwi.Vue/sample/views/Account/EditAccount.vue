<script setup lang="ts">
  import { MkForm } from "@/components";
  import { computed, reactive } from "vue";
  import { useNavigation } from "@/composables/useNavigation";
  import MkConfirmDialog from "@/components/MkConfirmDialog/MkConfirmDialog.vue";
  import { useValidationRules } from "@/composables";
  import MkFormSideSheet from "@/components/MkForm/MkFormSideSheet.vue";
  import TransferMoneyDialog from "./partials/TransferMoneyDialog.vue";
  import { sampleApi, AccountDto, DepositMoneyRequest, WithdrawMoneyRequest } from "@sample/services";

  const navigation = useNavigation();
  const { required } = await useValidationRules();
  const accountNumber = computed<string>(() => navigation.currentViewParameter.value as string);

  const state = reactive({
    account: <AccountDto>{},
    amount: <number | undefined>undefined,
    depositSheet: false,
    withdrawSheet: false,
    transferMoneyDialog: false,
  });

  async function onClose() {
    state.account = (await sampleApi.accountCloseAccountCreate(state.account.number!)).data;

    // Reload the account
    onLoad();
  }

  async function onCloseWithError() {
    // Let it break!
    state.account = (await sampleApi.accountCloseAccountCreate("123456789")).data;
  }

  async function onLoad() {
    state.account = (await sampleApi.accountGet(accountNumber.value!)).data;
  }

  async function onDeposit() {
    const request = <DepositMoneyRequest>{
      amount: state.amount || 0,
    };

    await sampleApi.accountDepositCreate(state.account.number!, request);

    // Reload the account
    onLoad();
  }

  async function onWithdraw() {
    const request = <WithdrawMoneyRequest>{
      amount: state.amount || 0,
    };

    await sampleApi.accountWithdrawCreate(state.account.number!, request);

    // Reload the account
    onLoad();
  }
</script>
<template>
  <MkForm title="Close Account" @load="onLoad" hide-undo>
    <template #toolbar>
      <v-btn @click="state.depositSheet = true">Deposit</v-btn>
      <v-btn @click="state.withdrawSheet = true">Withdraw</v-btn>
      <v-btn variant="flat" @click="state.transferMoneyDialog = true">Transfer</v-btn>
    </template>
    <template #overflowIconItems>
      <MkConfirmDialog @confirm="onCloseWithError" body="Are you sure you wan't de close this account">
        <template #activator="{ props }">
          <v-list-item v-bind="props" color="primary"> Close Account With Error </v-list-item>
        </template>
      </MkConfirmDialog>
      <MkConfirmDialog @confirm="onClose" body="Are you sure you wan't de close this account">
        <template #activator="{ props }">
          <v-list-item v-bind="props" color="primary"> Close Account </v-list-item>
        </template>
      </MkConfirmDialog>
    </template>

    <v-alert type="warning" v-if="state.account?.status === 'Closed'" class="mb-6" closable>This account is closed</v-alert>
    <v-text-field readonly label="Account Number" v-model="state.account.number" :rules="[(v: any) => !!v || 'Required']" />
    <v-text-field readonly label="Holder Name" v-model="state.account.holderName" :rules="[(v: any) => !!v || 'Required']" />
    <v-text-field readonly label="Current Balance" v-model="state.account.balance" />
  </MkForm>

  <MkFormSideSheet
    v-model="state.depositSheet"
    title="Deposit"
    @submit="onDeposit"
    edit-labels
    entryName="amount"
    :close-on-submit="false"
    :reset-on-submit="false"
  >
    <v-text-field label="Amount" v-model="state.amount" :rules="[required]" type="number" />
  </MkFormSideSheet>

  <MkFormSideSheet v-model="state.withdrawSheet" title="Withdraw" @submit="onWithdraw" edit-labels entryName="amount">
    <v-text-field label="Amount" v-model="state.amount" :rules="[required]" type="number" />
  </MkFormSideSheet>

  <TransferMoneyDialog v-model="state.transferMoneyDialog" @update:model-value="onLoad" />
</template>
