# MkFormDialog

The MkFormDialog component can be used when displaying a form on the page in a v-dialog component

## Basic Implementation

```tsx
<script setup lang="ts">
  const { required } = useValidationRules();
  const state = reactive({
    showDialog: false,
    user: {
      name: string,
      email: string,
    }
  })

  async function onLoad() {
    state.user = await connector.GetUserAsync(1);
  }

  async function onSubmit() {
    state.user = await connector.SaveUser(state.user);
  }
</script>

<template>
  <MkFormDialog v-model="state.showDialog" close-on-submit width="800" @submit="onSubmit" >
    <v-text-field label="Name" v-model="state.name" :rules="[required]" />
    <v-text-field label="Email" v-model="state.email" :rules="[required]" />
  </MkForm>
</template>
```

## Custom error handling

```tsx
<script setup lang="ts">
  const { required } = useValidationRules();
  const state = reactive({
    showDialog: false,
    user: {
      name: string,
      email: string,
    }
    errorProblemDetails: <ErrorProblemDetails | undefined>undefined,
  })

  async function onLoad() {
    state.user = await connector.GetUserAsync(1);
  }

  async function onSubmit() {
    try {
      state.user = await connector.SaveUser(state.user);
    }
    catch (error: any) {
      // We're expecting the error
      state.errorProblemDetails = error;

      // Perform another method
      state.user = await connector.CreateUser(state.user);
    }
  }
</script>

<template>
  <MkFormDialog  v-model="state.showDialog"  v-model:error="state.rrorProblemDetails" width="800" @submit="onSubmit">
    <v-text-field label="Name" v-model="state.name" :rules="[required]" />
    <v-text-field label="Email" v-model="state.email" :rules="[required]" />
  </MkForm>
</template>
```
