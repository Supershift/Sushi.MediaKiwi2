<script setup lang="ts">
  import { ref } from "vue";
  import { TableMapItemIconOptions } from "@/models/table/TableMapItemIconOptions";
  import { IconPosition } from "@/models";
  import { computed } from "@vue/reactivity";

  const props = defineProps<{
    data?: any;
    icon?: string | ((entity: any) => TableMapItemIconOptions);
  }>();

  const iconOptions = computed(() => {
    return props.icon && typeof props.icon === "function" ? props.icon(props.data) : null;
  });

  const value = computed(() => {
    if (iconOptions.value) {
      return iconOptions.value.value || "";
    } else {
      return props.icon;
    }
  });

  const toolTip = computed(() => {
    if (iconOptions.value) {
      return iconOptions.value.tooltip;
    }
    return "";
  });

  const position = computed(() => {
    if (iconOptions.value) {
      return iconOptions.value.position;
    }
    return IconPosition.inFront;
  });

  const iconClasses = computed(() => {
    return {
      "ml-2": position.value === IconPosition.behind,
      "mr-2": position.value !== IconPosition.behind,
    };
  });

  const showTooltip = ref(false);
</script>

<template>
  <v-tooltip v-model="showTooltip" location="top" :disabled="!toolTip">
    <template #activator="{ props }">
      <v-icon v-bind="props" :icon="value" :class="iconClasses"></v-icon>
    </template>
    <span>{{ toolTip }}</span>
  </v-tooltip>
</template>
