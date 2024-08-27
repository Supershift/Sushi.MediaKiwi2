# Validation Rules

Validation rules can be used for the client side validation.

Import the rules form the useValidationRules composable, and add them to the rules on the vuetify element.
The validation is automatically performed when the submit handler is triggered.

```tsx
<script>
  const { required, minLength, maxLength, numeric, alphaNumericNoSpace, alphaNumericWithSpace, email } = await useValidationRules();
</script>

<template>
  <MkForm @load="onLoad" @submit="onSubmit">
    <v-text-field label="Required" v-model="state.value1" :rules="[required]" />
    <v-text-field label="Min length" v-model="state.value2" :rules="[required, minLength(3)]" />
    <v-text-field label="Max length" v-model="state.value3" :rules="[required, maxLength(10)]" />
    <v-text-field label="Email" v-model="state.emailAddress" :rules="[required, email]" />
    <v-text-field label="Alphanumeric no space" v-model="state.name" :rules="[required, alphaNumericNoSpace]" />
    <v-text-field label="Alphanumeric with space" v-model="state.displayName" :rules="[required, alphaNumericWithSpace]" />
    <v-text-field label="Numeric" v-model="state.value1" :rules="[required, numeric]" />
  </MkForm>
</template>
```
