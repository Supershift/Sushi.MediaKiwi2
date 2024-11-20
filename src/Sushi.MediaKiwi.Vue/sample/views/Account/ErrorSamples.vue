<script setup lang="ts">
  import { MkForm } from "@/components";
  import { reactive } from "vue";
  import { useValidationRules } from "@/composables";
  import { ErrorProblemDetails, TResult } from "@/models";
  import { sampleApi } from "@sample/services";

  const { required, minLength, maxLength, numeric, alphaNumericNoSpace, alphaNumericWithSpace, email } = await useValidationRules();

  const state = reactive({
    value1: <string | undefined>undefined,
    value2: <string | undefined>"1",
    value3: <string | undefined>"12345678901",
    emailAddress: <string | undefined>"1",
    name: <string | undefined>"",
    displayName: <string | undefined>"@",
    file: <File | undefined>undefined,
    files: <File[] | undefined>undefined,
    inProgress: <boolean | undefined>false,
    error: <ErrorProblemDetails | undefined>undefined,
  });

  function throwCustomError() {
    throw new Error("This is a test error");
  }

  function throwError() {
    throw new Error();
  }

  async function getGenericErrorFromApi() {
    return new Promise<void>(async (resolve, reject) => {
      state.inProgress = true;
      setTimeout(() => {
        sampleApi.errorGenericError().catch((error) => {
          state.inProgress = false;
          reject(error);
        });
      }, 2000);
    });
  }

  async function getAggregateError() {
    await sampleApi.errorAggregateError();
  }

  async function getInternalServerError() {
    await sampleApi.errorInternalServerError();
  }

  async function getTimeoutError() {
    await sampleApi.errorSlow({ timeout: 1 });
  }

  async function onSubmit() {
    // Assume a 200 API call with but with a custom error
    return TResult.failure(new ErrorProblemDetails("This is an expected error"));
  }

  async function getStringError() {
    await sampleApi.errorStringError();
  }

  async function onLoad() {
    //
  }
</script>

<template>
  <MkForm @submit="onSubmit" v-model:error="state.error" v-model:in-progress="state.inProgress">
    <template #toolbar>
      <v-btn @click="throwCustomError()">Custom error</v-btn>
      <v-btn @click="throwError()">Unexpected error</v-btn>
      <v-btn @click="getAggregateError()">Aggregate Error</v-btn>
      <v-btn @click="getGenericErrorFromApi()">Generic Error</v-btn>
      <v-btn @click="getInternalServerError()"> Server Error</v-btn>
      <v-btn @click="getTimeoutError()">Timeout</v-btn>
      <v-btn @click="getStringError()">String error</v-btn>
    </template>
    <v-text-field v-model="state.value1" :rules="[required]" />
  </MkForm>

  <v-divider class="my-10"></v-divider>

  <v-card>
    <v-card-title>Errors outside the form actions</v-card-title>
    <v-btn @click="throwCustomError()">Custom error</v-btn>
    <v-btn @click="throwError()">Unexpected error</v-btn>
    <v-btn @click="getAggregateError()">Aggregate Error</v-btn>
    <v-btn @click="getGenericErrorFromApi()">Generic Error</v-btn>
    <v-btn @click="getInternalServerError()">Internal Server Error</v-btn>
    <v-btn @click="getTimeoutError()">Timeout</v-btn>
  </v-card>

  <MkForm @submit="onLoad">
    <v-text-field label="Required" v-model="state.value1" :rules="[required]" />
    <v-text-field label="Min length (3)" v-model="state.value2" :rules="[required, minLength(3)]" />
    <v-text-field label="Max length (10)" v-model="state.value3" :rules="[required, maxLength(10)]" />
    <v-text-field label="Email" v-model="state.emailAddress" :rules="[required, email]" />
    <v-text-field label="Alphanumeric no space" v-model="state.name" :rules="[required, alphaNumericNoSpace]" />
    <v-text-field label="Alphanumeric with space" v-model="state.displayName" :rules="[required, alphaNumericWithSpace]" />
    <v-text-field label="Numeric" v-model="state.value1" :rules="[required, numeric]" />

    <v-divider class="my-8"></v-divider>

    <v-label class="mb-8">Nullable</v-label>

    <v-text-field label="Min length (3)" :rules="[minLength(3)]" />
    <v-text-field label="Max length (10)" :rules="[maxLength(10)]" />
    <v-text-field label="Email" :rules="[email]" />
    <v-text-field label="Alphanumeric no space" :rules="[alphaNumericNoSpace]" />
    <v-text-field label="Alphanumeric with space" :rules="[alphaNumericWithSpace]" />
    <v-text-field hide-details="auto" label="Numeric" :rules="[numeric]" />
  </MkForm>
</template>
