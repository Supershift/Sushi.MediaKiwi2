<script setup lang="ts">
  import { MkForm } from "@/components";
  import { computed, reactive } from "vue";
  import { AccountConnector } from "@sample/services/AccountConnector";
  import { container } from "tsyringe";
  import { CreateAccountRequest } from "@sample/models/Account/CreateAccountRequest";
  import { useNavigation } from "@/composables/useNavigation";

  const connector = container.resolve(AccountConnector);
  const { currentViewParameter } = useNavigation();

  const state = reactive({
    account: <CreateAccountRequest>{
      number: <string | undefined>undefined,
      holderName: <string | undefined>undefined,
    },
  });

  const accountNumber = computed(() => currentViewParameter.value);

  async function onClose() {
    state.account = await connector.CloseAccountAsync(state.account.number!)!;
  }

  async function onGet() {
    state.account = await connector.GetAccountAsync(accountNumber.value!)!;
  }
</script>
<template>
  <MkForm title="Close Account" :on-load="onGet" show-problem-details-detail-field>
    <template #toolbar>
      <v-btn @click="onClose" color="primary"> Close Account </v-btn>
    </template>
    <v-text-field label="Account Number" v-model="state.account.number" :rules="[(v: any) => !!v || 'Required']" />
    <v-text-field label="Holder Name" v-model="state.account.holderName" :rules="[(v: any) => !!v || 'Required']" />
  </MkForm>
</template>
