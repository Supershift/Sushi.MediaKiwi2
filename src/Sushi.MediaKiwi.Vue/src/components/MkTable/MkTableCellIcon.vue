<script setup lang="ts">
  import { ref } from "vue";
  import { ITableMapItemIconOptions } from "@/models/table/ITableMapItemIconOptions";
  import { IconPosition } from "@/models";
  import { computed } from "@vue/reactivity";

  const props = defineProps<{
    data?: any;
    icon?: string | ITableMapItemIconOptions<any> | ((entity: any) => string);
  }>();

  const value = computed(() => {
    if (props.icon && typeof props.icon === "object") {
      if (typeof props.icon.value === "function") {
        return props.icon.value(props.data);
      } else {
        return props.icon.value;
      }
    } else if (props.icon && typeof props.icon === "function") {
      return props.icon(props.data) || "";
    } else {
      return props.icon;
    }
  });

  const toolTip = computed(() => {
    if (props.icon && typeof props.icon === "object" && props.icon.tooltip) {
      if (typeof props.icon.value === "function") {
        return props.icon.tooltip(props.data);
      } else {
        return props.icon.tooltip;
      }
    }
    return "";
  });

  function iconClasses() {
    return props.icon && typeof props.icon === "object" && props.icon?.position === IconPosition.behind ? "ml-2" : "mr-2";
  }

  const showTooltip = ref(false);
</script>

<template>
  <v-tooltip v-model="showTooltip" location="top" :disabled="!toolTip">
    <template #activator="{ props }">
      <v-icon v-bind="props" :icon="value" :class="iconClasses()"></v-icon>
    </template>
    <span>{{ toolTip }}</span>
  </v-tooltip>
</template>
