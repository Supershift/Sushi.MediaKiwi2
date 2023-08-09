<script setup lang="ts">
  import type { ITableFilterItem } from "@supershift/mediakiwi-vue";
  import type { ITableFilterValue } from "@supershift/mediakiwi-vue";

  const props = defineProps<{
    tableFilterItem: ITableFilterItem;
    modelValue: ITableFilterValue;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: ITableFilterValue): void;
  }>();

  function firstNameChanged(firstName: string) {
    emit("update:modelValue", {
      title: firstName + " " + props.modelValue?.value?.surName,
      value: { firstName: firstName, surName: props.modelValue?.value?.surName },
    });
  }

  function surNameChanged(surName: string) {
    emit("update:modelValue", {
      title: props.modelValue?.value?.firstName + " " + surName,
      value: { firstName: props.modelValue?.value?.firstName, surName: surName },
    });
  }
</script>

<template>
  <v-text-field :value="modelValue?.value.firstName" @update:model-value="firstNameChanged" label="Voornaam"> </v-text-field>
  <v-spacer></v-spacer>
  <v-text-field :value="modelValue?.value.surName" @update:model-value="surNameChanged" label="Achternaam"> </v-text-field>
</template>
