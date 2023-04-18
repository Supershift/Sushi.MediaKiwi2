<script setup lang="ts">
  import { computed } from "vue";
  import { IconPosition } from "@/models";
  import type { ITableMapItem } from "@/models/table/ITableMapItem";
  import MkTableCellIcon from "./MkTableCellIcon.vue";

  const props = defineProps<{
    data: any;
    mapItem: ITableMapItem<any>;
  }>();

  function invokeMapItemValue(mapItem: ITableMapItem<any>) {
    if (mapItem?.value !== undefined) {
      return mapItem.value(props.data);
    } else {
      return undefined;
    }
  }

  const isBooleanValue = computed(() => typeof invokeMapItemValue(props.mapItem) === "boolean");

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
      <component :is="mapItem.component" :data="invokeMapItemValue(mapItem)"></component>
    </template>
    <!-- render the result for calling 'value()'-->
    <template v-else>
      <!-- render a boolean -->
      <template v-if="isBooleanValue">
        <MkTableCellIcon :icon="invokeMapItemValue(props.mapItem) ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'" />
      </template>

      <!-- render any other value -->
      <template v-else>
        <span class="row" :class="rowClasses">
          <!-- render icon if icon options are sest -->
          <MkTableCellIcon v-if="mapItem.icon" :icon="mapItem.icon" :data="data"></MkTableCellIcon>
          <!-- render value -->
          <label>{{ invokeMapItemValue(mapItem) }}</label>
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
