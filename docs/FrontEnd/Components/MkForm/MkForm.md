# MkForm

The MkForm component can be used when displaying a form on the page without any wrapper elements

## Basic Implementation

```tsx
<script setup lang="ts">
  const { required } = useValidationRules();
  const state = reactive({
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
  <MkForm @load="onLoad" @submit="onSubmit">
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
  <MkForm v-model:error="state.errorProblemDetails" @load="onLoad" @submit="onSubmit" >
    <v-text-field label="Name" v-model="state.name" :rules="[required]" />
    <v-text-field label="Email" v-model="state.email" :rules="[required]" />
  </MkForm>
</template>
```
