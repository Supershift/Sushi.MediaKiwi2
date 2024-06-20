<script setup lang="ts">
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { computed, ref } from "vue";
  import MkTableFilterDialog from "./MkTableFilterDialog.vue";
  import { useI18next } from "@/composables";

  const { defaultT } = await useI18next();

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
  }>();

  const modelValue = defineModel<TableFilterValue>({ required: true });

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();

  // Create proxy model to prevent direct mutation
  const model = ref<Array<string>>(modelValue.value?.value || []);

  // Additional rules for the input field
  const additionalRules = computed(() => props.tableFilterItem.rules || []);

  function applyFilter() {
    modelValue.value = {
      value: model.value,
    };
  }
</script>

<template>
  <MkTableFilterDialog :table-filter-item="tableFilterItem" @close="emit('click:close')" @apply="applyFilter">
    <div class="pl-0 py-4">
      <v-checkbox
        v-for="option in tableFilterItem.options"
        :key="option.value"
        v-model="model"
        :value="option.value"
        :label="option.title"
        density="comfortable"
        class="mk-table-filter__item__checkbox pl-3"
        hide-details="auto"
        :rules="[(v: any) => !!v && !!v.length || defaultT(`Filter.EmptyError`, `This field is required`), ...additionalRules]"
      />
    </div>
  </MkTableFilterDialog>
</template>
<style scoped lang="scss">
  @use "@/styles/abstracts/mixins" as mixins;

  .mk-table-filter__item__checkbox {
    &:hover {
      @include mixins.hover-effect;
    }
  }
</style>
