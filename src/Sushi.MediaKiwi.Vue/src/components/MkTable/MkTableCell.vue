<script setup lang="ts">
  import { computed } from "vue";
  import { MoneyValue, IconsLibrary } from "@/models";
  import type { TableMapItem } from "@/models/table/TableMapItem";
  import MkTableCellIcon from "./MkTableCellIcon.vue";
  import { useI18next } from "@/composables";
  import { TableCellIcon, TableIconPosition } from "@/models/table/TableCellIcon";

  // define properties
  const props = defineProps<{
    /** Table Map item  */
    mapItem?: TableMapItem<any>;
    /** Data object when using the mapItem */
    data?: any;
    /** Add your own value here */
    value?: any;
  }>();

  // inject dependencies
  const { formatNumber, formatMoneyValue } = await useI18next();

  // reactive variables

  /**
   * The current value of the cell.
   * This can be a value from the props or a value from the mapItem.
   */
  const currentValue = computed(() => {
    if (props.mapItem && props.data) {
      return props.mapItem.value ? props.mapItem.value(props.data) : undefined;
    } else if (props.value == null || props.value == undefined) {
      return null;
    } else {
      return props.value;
    }
  });

  // type detection
  const isBooleanValue = computed(() => typeof currentValue.value === "boolean");
  const isNumber = computed(() => typeof currentValue.value === "number");

  const isMoneyValue = computed(() => {
    const value = currentValue.value as any;
    return value?.currency && value?.amount;
  });

  const isIcon = computed(() => {
    const value = currentValue.value as TableCellIcon;
    return value?.iconName;
  });

  const booleanIcon = computed(() => {
    const value = currentValue.value as boolean;
    const iconName = value ? IconsLibrary.checkCircleOutline : IconsLibrary.closeCircleOutline;
    const color = value ? "success" : "error";

    return {
      iconName,
      color,
      position: TableIconPosition.Append,
    };
  });
</script>

<template>
  <td>
    <!-- render a dynamic component-->
    <template v-if="mapItem?.component">
      <component :is="mapItem.component" :data="currentValue"></component>
    </template>
    <!-- render a slot -->
    <template v-else-if="currentValue === null || currentValue === undefined">
      <slot></slot>
    </template>
    <!-- render the result for the currentValue -->
    <template v-else>
      <!-- render a boolean -->
      <template v-if="isBooleanValue">
        <MkTableCellIcon :data="booleanIcon"></MkTableCellIcon>
      </template>
      <!-- render a number -->
      <template v-else-if="isNumber"> {{ formatNumber(currentValue as number) }} </template>
      <!-- render a money value -->
      <template v-else-if="isMoneyValue"> {{ formatMoneyValue(currentValue as MoneyValue) }}</template>
      <!-- reander an icon -->
      <template v-else-if="isIcon">
        <MkTableCellIcon :data="(currentValue as TableCellIcon)"></MkTableCellIcon>
      </template>
      <!-- render any other value -->
      <template v-else>
        <label>{{ currentValue }}</label>
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

  td {
    // Every first child, whatever it it.
    > * {
      white-space: nowrap;
    }
  }
</style>
