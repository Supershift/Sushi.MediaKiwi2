<script setup lang="ts">
  import { ref, computed } from "vue";
  import { IconPosition, ITableMapItemIconOptions } from "@/models";
  import type { ITableMapItem } from "@/models/table/ITableMapItem";
  import MkTableCellIcon from "./MkTableCellIcon.vue";
  import { IconOptions } from "vuetify/lib/framework.mjs";

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
        <MkTableCellIcon :icon-options="{ value: () => (invokeMapItemValue(props.mapItem) ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline') }" />
      </template>

      <!-- render any other value -->
      <template v-else>
        <!-- optionally render icon -->
        <MkTableCellIcon :data="data" :icon-options="mapItem.iconOptions">
          <template v-if="mapItem.iconOptions?.position === IconPosition.behind" #in-front-icon>
            {{ invokeMapItemValue(mapItem) }}
          </template>
          <template v-else #behind-icon>
            {{ invokeMapItemValue(mapItem) }}
          </template>
        </MkTableCellIcon>

        <!-- <label></label> -->

        <!-- render icon behind -->
        <!-- <MkTableCellIcon v-if="mapItem.iconOptions && mapItem.iconOptions.position === IconPosition.behind" :data="data" :icon-options="mapItem.iconOptions" /> -->
      </template>
    </template>
  </td>
</template>
