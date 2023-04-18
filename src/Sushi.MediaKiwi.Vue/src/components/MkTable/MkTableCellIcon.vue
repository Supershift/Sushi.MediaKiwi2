<script setup lang="ts">
  import { ref } from "vue";
  import { TableMapItemIconOptions } from "@/models/table/TableMapItemIconOptions.js";
  import { IconPosition } from "@/models";

  const props = defineProps<{
    data?: any;
    iconOptions?: TableMapItemIconOptions<any>;
  }>();

  function invokeIconValue() {
    return props.iconOptions?.value ? props.iconOptions.value(props.data) : "";
  }

  function invokeToolTopValue() {
    return props.iconOptions?.tooltip ? props.iconOptions.tooltip(props.data) : "";
  }

  function iconClasses() {
    return {
      "ml-2": props.iconOptions?.position === IconPosition.behind,
      "mr-2": props.iconOptions?.position !== IconPosition.behind,
    };
  }

  const showTooltip = ref(false);
</script>

<template>
  <v-tooltip v-model="showTooltip" location="top" :disabled="!props.iconOptions?.tooltip">
    <template #activator="{ props }">
      <v-icon v-bind="props" :icon="invokeIconValue()" :class="iconClasses()"></v-icon>
    </template>
    <span>{{ invokeToolTopValue() }}</span>
  </v-tooltip>
</template>
