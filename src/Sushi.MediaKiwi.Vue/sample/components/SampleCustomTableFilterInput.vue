<script setup lang="ts">
  import { MkDialogCard } from "@/framework";
  import { useI18next, type TableFilterItem } from "@/framework";
  import type { TableFilterValue } from "@/framework";
  import { reactive } from "vue";

  // inject dependencies
  const { defaultT } = await useI18next();

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
    modelValue: TableFilterValue;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilterValue): void;
    (e: "click:close"): void;
  }>();

  // state
  const refFullName = reactive(props.modelValue?.value ?? { firstName: "", surName: "" });

  function applyFilter() {
    emit("update:modelValue", {
      title: refFullName.firstName + " " + refFullName.surName,
      value: refFullName,
    });
  }
</script>

<template>
  <MkDialogCard :title="tableFilterItem.title" content-classes="pa-6 pb-0" @click:close="() => emit('click:close')">
    <template #intro> Please enter the correct name </template>
    <template #default>
      <v-form>
        <v-text-field v-model="refFullName.firstName" label="Voornaam" />
        <v-text-field v-model="refFullName.surName" label="Achternaam" />
      </v-form>
    </template>
    <template #actions>
      <v-btn @click="applyFilter">{{ defaultT("Apply") }}</v-btn>
    </template>
  </MkDialogCard>
</template>
