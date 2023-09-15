<script setup lang="ts">
  import { computed } from "vue";
  import { MoneyValue, IconsLibrary } from "@/models";
  import type { TableMapItem } from "@/models/table/TableMapItem";
  import MkTableCellIcon from "./MkTableCellIcon.vue";
  import { useI18next } from "@/composables";
  import { TableCellIcon, TableIconPosition } from "@/models/table/TableCellIcon";

  // define properties
  const props = defineProps<{
    data: any;
    mapItem: TableMapItem<any>;
  }>();

  const emit = defineEmits<{
    (e: "update:data", mapItem: TableMapItem<any>, value: unknown): void;
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

  const booleanIcon = computed(() => {
    const value = mapItemValue.value as boolean;
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
    <template v-if="mapItem.component">
      <component :is="mapItem.component" :data="mapItemValue"></component>
    </template>
    <template v-else-if="mapItem.editOptions && mapItem.editOptions.component">
      <span @click.stop>
        <component
          :is="mapItem.editOptions.component"
          :data="mapItemValue"
          v-bind="mapItem.editOptions.componentProps"
          @update:data="(value: unknown) => emit('update:data', mapItem, value)"
        ></component>
      </span>
    </template>
    <!-- render the result for calling 'value()'-->
    <template v-else>
      <!-- render a boolean -->
      <template v-if="isBooleanValue">
        <MkTableCellIcon :data="booleanIcon"></MkTableCellIcon>
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
