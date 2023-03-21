<script setup lang="ts">
  import { ref, watch } from "vue";
  const props = defineProps<{
    isIndeterminate?: boolean;
    isSelected?: boolean;
  }>();

  const emit = defineEmits<{
    (e: "update:isSelected", value: boolean): void;
  }>();

  function selectChanged(selectedValue: boolean) {
    emit("update:isSelected", selectedValue);
  }

  const value = ref(props.isSelected);

  watch(
    () => props.isSelected,
    () => {
      value.value = props.isSelected;
    }
  );
</script>
<template>
  <v-checkbox v-model="value" :indeterminate="props.isIndeterminate" :hide-details="true" density="comfortable" @update:model-value="selectChanged"></v-checkbox>
</template>
