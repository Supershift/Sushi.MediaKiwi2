<script setup lang="ts">
  import { ref } from "vue";

  const props = defineProps<{
    data?: string;
  }>();

  const emit = defineEmits<{
    (e: "update:data", value: boolean): void;
  }>();

  function onChange() {
    console.log(value.value);
    emit("update:data", value.value);
  }

  const value = ref<boolean>(props.data ?? false);
</script>

<template>
  <v-text-field v-model="value" variant="text" hide-details @blur="onChange" />
</template>
