<script setup lang="ts">
  import { ref } from "vue";

  const props = defineProps<{
    // Country Code
    data?: any;
    options: any[];
  }>();

  const emit = defineEmits<{
    // Country Code
    (e: "update:data", value: string): void;
  }>();

  function onChange(value: string) {
    emit("update:data", value);
  }

  const value = ref(props.data ?? "");
</script>

<template>
  <VAutocomplete v-model="value" variant="plain" :items="options" @update:model-value="onChange" />
</template>
