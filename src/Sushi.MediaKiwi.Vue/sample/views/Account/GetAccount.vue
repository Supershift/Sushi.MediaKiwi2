<script setup lang="ts">
  import { MkForm } from "@/components";
  import { container } from "tsyringe";
  import { reactive } from "vue";
  import { useNavigation, useValidationRules } from "@/composables";
  import CreateAccountDialog from "./partials/CreateAccountDialog.vue";
  import { AccountDto, Api } from "@sample/services";

  const { sample: sampleApi } = container.resolve<Api<any>>("SampleApi");
  const { required } = await useValidationRules();
  const navigation = useNavigation();

  const state = reactive({
    accountNumber: <string | undefined>undefined,
    account: <AccountDto | undefined>undefined,
    createAccountDialog: false,
    accountDetailsSheet: false,
  });

  async function onGet() {
    state.account = (await sampleApi.accountDetail(state.accountNumber!)).data;
    if (state.account) {
      navigation.navigateToId("EditAccount", state.account.number);
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
