<script setup lang="ts">
  import { ColorMap } from "@/models/color/ColorMap";
  import { computed } from "vue";
  import ColorBlock from "./ColorBlock.vue";
  import { useColors } from "@/composables";

  const props = defineProps<{
    theme: string;
  }>();

  const colors = useColors(props.theme);

  const lighColors = computed(() => colors.colors.value?.filter((color) => color.key.indexOf("on-") === -1));
  const lighOnColors = computed(() => colors.colors.value?.filter((color) => color.key.indexOf("on-") > -1));

  const order = ["primary", "secondary", "tertiary", "error", "background", "surface"];
  function groupColors(items: ColorMap[]): Record<string, ColorMap[]> {
    // Initialize groups based on the order with empty arrays
    const initialGroups = order.reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {} as Record<string, ColorMap[]>);

    // Use reduce to group items
    return items.reduce((acc, item) => {
      // Extract the base key (e.g., "primary" from "on-primary")
      const baseKey = order.find((o) => item.key.includes(o));

      if (baseKey) {
        acc[baseKey].push(item);
      } else {
        if (!acc["others"]) {
          acc["others"] = [];
        }
        acc["others"].push(item);
      }

      return acc;
    }, initialGroups);
  }

  const groupedColors = computed(() => groupColors(lighColors.value));
  const groupedOnColors = computed(() => groupColors(lighOnColors.value));

  function findMatch(key: string, color: ColorMap): ColorMap | undefined {
    const collection = color.key.includes("on-") ? groupedColors.value : groupedOnColors.value;
    const matchKey = color.key.includes("on-") ? color.key.replace("on-", "") : `on-${color.key}`;

    return collection[key]?.find((x) => x.key === matchKey);
  }
</script>

<template>
  <div class="d-flex flex-column ga-2">
    <div v-for="(group, key) in groupedColors" class="color d-flex ga-2 flex-wrap">
      <ColorBlock
        v-for="color in group"
        class="color__item pa-3 d-flex flex-column justify-space-between"
        :color="color"
        :contrast-color="findMatch(key, color)"
      />
      <ColorBlock
        v-for="onColor in groupedOnColors[key]"
        class="color__item pa-3 d-flex flex-column justify-space-between"
        :color="onColor"
        :contrast-color="findMatch(key, onColor)"
      />
    </div>
  </div>
</template>
