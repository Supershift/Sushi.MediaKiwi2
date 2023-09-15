<script setup lang="ts">
  import { ref } from "vue";

  const props = defineProps<{
    data?: boolean;
  }>();

  const emit = defineEmits<{
    (e: "update:data", value: boolean): void;
  }>();

  function onChange(value: boolean) {
    emit("update:data", value);
  }

  const value = ref<boolean>(props.data ?? false);
</script>

<template>
  <VCheckbox v-model="value" variant="plain" hide-details @update:model-value="onChange" />
</template>
