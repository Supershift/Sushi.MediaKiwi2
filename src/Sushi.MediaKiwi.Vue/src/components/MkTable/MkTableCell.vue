<script setup lang="ts">
  import { computed } from "vue";
  import { MoneyValue } from "@/models";
  import type { TableMapItem } from "@/models/table/TableMapItem";
  import MkTableCellIcon from "./MkTableCellIcon.vue";
  import { useI18next } from "@/composables";
  import { TableCellIcon } from "@/models/table/TableCellIcon";

  // define properties
  const props = defineProps<{
    data: any;
    mapItem: TableMapItem<any>;
  }>();

  // inject dependencies
  const { formatNumber, formatMoneyValue } = await useI18next();

  // reactive variables
  const mapItemValue = computed(() => (props.mapItem.value ? props.mapItem.value(props.data) : undefined));

  // type detection
  const isBooleanValue = computed(() => typeof mapItemValue.value === "boolean");
  const isNumber = computed(() => typeof mapItemValue.value === "number");

  const isMoneyValue = computed(() => {
    const value = mapItemValue.value as any;
    return value?.currency && value?.amount;
  });

  const isIcon = computed(() => {
    const value = mapItemValue.value as TableCellIcon;
    return value?.iconName;
  });
</script>

<template>
  <td>
    <!-- render a dynamic component-->
    <template v-if="mapItem.component !== undefined">
      <component :is="mapItem.component" :data="mapItemValue"></component>
    </template>
    <!-- render the result for calling 'value()'-->
    <template v-else>
      <!-- render a boolean -->
      <template v-if="isBooleanValue">
        <v-icon :icon="mapItemValue ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'" :color="mapItemValue ? 'success' : 'error'"></v-icon>
      </template>
      <!-- render a number -->
      <template v-else-if="isNumber"> {{ formatNumber(mapItemValue as number) }} </template>
      <!-- render a money value -->
      <template v-else-if="isMoneyValue"> {{ formatMoneyValue(mapItemValue as MoneyValue) }}</template>
      <!-- reander an icon -->
      <template v-else-if="isIcon">
        <MkTableCellIcon :data="(mapItemValue as TableCellIcon)"></MkTableCellIcon>
      </template>
      <!-- render any other value -->
      <template v-else>
        <label>{{ mapItemValue }}</label>
      </template>
    </template>
  </td>
</template>

<style scoped lang="scss">
  .row {
    display: inline-flex;
    flex-flow: row nowrap;

    &.reverse {
      flex-direction: row-reverse;
      justify-content: flex-end;
    }
  }
</style>
