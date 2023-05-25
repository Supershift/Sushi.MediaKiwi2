<script setup lang="ts">
  import { computed, ref } from "vue";
  import { IconPosition, MoneyValue } from "@/models";
  import type { TableMapItem } from "@/models/table/TableMapItem";
  import MkTableCellIcon from "./MkTableCellIcon.vue";
  import { useI18next } from "@/composables";

  // define properties
  const props = defineProps<{
    data: any;
    mapItem: TableMapItem<any>;
  }>();

  // inject dependencies
  const { formatNumber, formatMoneyValue } = useI18next();

  // reactive variables
  const mapItemValue = computed(() => (props.mapItem.value ? props.mapItem.value(props.data) : undefined));

  const isBooleanValue = computed(() => typeof mapItemValue.value === "boolean");
  const isNumber = computed(() => typeof mapItemValue.value === "number");

  const isMoneyValue = computed(() => {
    const value = mapItemValue.value as any;
    return value?.currency && value?.amount;
  });

  const iconOptions = computed(() => {
    return props.mapItem.icon && typeof props.mapItem.icon === "function" ? props.mapItem.icon(props.data) : null;
  });

  const rowClasses = computed(() => {
    return {
      reverse: iconOptions.value?.position === IconPosition.behind,
    };
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
        <MkTableCellIcon :icon="mapItemValue ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'" />
      </template>
      <!-- render a number -->
      <template v-else-if="isNumber"> {{ formatNumber(mapItemValue as number) }} </template>
      <!-- render a money value -->
      <template v-else-if="isMoneyValue"> {{ formatMoneyValue(mapItemValue as MoneyValue) }}</template>
      <!-- render any other value -->
      <template v-else>
        <span class="row" :class="rowClasses">
          <!-- render icon if icon options are sest -->
          <MkTableCellIcon v-if="mapItem.icon" :icon="mapItem.icon" :data="data"></MkTableCellIcon>
          <!-- render value -->
          <label>{{ mapItemValue }}</label>
        </span>
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
