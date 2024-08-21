<script setup lang="ts">
  import { MkForm } from "@/components";
  import { Account } from "@sample/models/Account/Account";
  import { container } from "tsyringe";
  import { reactive } from "vue";
  import { useValidationRules } from "@/composables";
  import { ErrorConnector } from "@sample/services/ErrorConnector";

  const errorConnector = container.resolve(ErrorConnector);
  const { required } = useValidationRules();

  const state = reactive({
    accountNumber: <string | undefined>"1",
    account: <Account | undefined>undefined,
    errorType: <string | undefined>undefined,
  });

  function throwCustomError() {
    throw new Error("This is a test error");
  }

  function throwError() {
    throw new Error();
  }

  async function getGenericErrorFromApi() {
    await errorConnector.getGenericError();
  }

  async function getAggregateError() {
    await errorConnector.getAggregateError();
  }
</script>

<template>
  <MkForm @submit="getGenericErrorFromApi">
    <template #toolbar>
      <v-btn @click="throwCustomError()">Throw custom error</v-btn>
      <v-btn @click="throwError()">Throw unexpected error</v-btn>
      <v-btn @click="getAggregateError()">Aggregate API Error</v-btn>
    </template>
    <v-text-field label="Account Number" v-model="state.accountNumber" :rules="[required]" />
  </MkForm>

  <v-divider class="my-10"></v-divider>

  <v-card>
    <v-card-title>Errors outside the form actions</v-card-title>
    <v-btn @click="throwCustomError()">Throw custom error</v-btn>
    <v-btn @click="throwError()">Throw unexpected error</v-btn>
    <v-btn @click="getGenericErrorFromApi()">Get Generic API error</v-btn>
    <v-btn @click="getAggregateError()">Get Aggregate API Error</v-btn>
  </v-card>
</template>
