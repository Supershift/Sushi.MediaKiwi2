<script setup lang="ts">
  import type { TableFilterItem } from "@supershift/mediakiwi-vue";
  import type { TableFilterValue } from "@supershift/mediakiwi-vue";
  import { reactive } from "vue";

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
    modelValue: TableFilterValue;
  }>();

  const refFullName = reactive(props.modelValue?.value ?? { firstName: "", surName: "" });

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilterValue): void;
  }>();

  function onChange() {
    emit("update:modelValue", {
      title: refFullName.firstName + " " + refFullName.surName,
      value: refFullName,
    });
  }
</script>

<template>
  <v-text-field v-model="refFullName.firstName" label="Voornaam" @update:model-value="onChange"> </v-text-field>
  <v-spacer></v-spacer>
  <v-text-field v-model="refFullName.surName" label="Achternaam" @update:model-value="onChange"> </v-text-field>
</template>
