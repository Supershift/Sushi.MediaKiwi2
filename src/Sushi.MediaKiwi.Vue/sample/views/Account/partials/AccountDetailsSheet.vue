<script setup lang="ts">
  import { Account } from "@sample/models/Account/Account";
  import MkFormSideSheet from "@/components/MkForm/MkFormSideSheet.vue";
  import { useNavigation } from "@/composables";

  const navigation = useNavigation();

  const account = defineModel<Account>("account", { required: true });

  async function navigateToEdit() {
    navigation.navigateToView("EditAccount", account.value.number);
  }
</script>
<template>
  <MkFormSideSheet confirm-before-submit title="Account Information">
    <v-alert type="warning" v-if="account?.status === 'Closed'" class="mb-6" closable>This account is closed</v-alert>

    <v-text-field label="Holder Name" v-model="account.holderName" disabled />
    <v-text-field label="Current Balance" v-model="account.balance" disabled />

    <template #actions>
      <v-btn variant="flat" @click="navigateToEdit">Edit</v-btn>
    </template>
  </MkFormSideSheet>
</template>
