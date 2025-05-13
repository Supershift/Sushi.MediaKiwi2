<script lang="ts" setup>
  import MkTable from "@/components/MkTable/MkTable.vue";
  import { computed } from "vue";

  const items = defineModel<Array<any>>("items", { required: true });
  const selection = defineModel<Array<any>>("selection", { required: true });

  const isRegion = (item: any) => {
    return item && item.countries && item.value;
  };

  const props = defineProps<{
    onAssetDisabled?: (item: any) => boolean;
    multiple?: boolean;
  }>();

  const assetClasses = computed(() => {
    return (item: any) => {
      return {
        disabled: props.onAssetDisabled?.(item),
      };
    };
  });

  function onItemClick(item: any) {
    if (!props.multiple) {
      selection.value.splice(0, selection.value.length); // clear the selection
    }

    if (!selection.value.includes(item)) {
      selection.value.push(item);
    } else {
      // remove the item from the selected assets
      const index = selection.value.findIndex((selectedItem) => selectedItem.path === item.path);
      if (index > -1) {
        selection.value.splice(index, 1);
      }
    }
  }
</script>
<template>
  <div class="folder-tree">
    <MkTable
      v-model:selection="selection"
      :data="items"
      :item-id="(item: any) => item.value"
      :disable-item-selection="props.onAssetDisabled"
      hide-selection-checkbox
      hide-bulk-action-bar
      class="folder-tree__table"
      @click:row="onItemClick"
    >
      <template #tbody="{ dataItem }">
        <td class="icon"><v-icon icon="symbols:imagesmode" color="secondary"></v-icon></td>
        <td>{{ dataItem.title }}</td>
      </template>
    </MkTable>
  </div>
</template>
<style scoped lang="scss">
  .folder-tree {
    .icon {
      width: 50px;
    }

    .disabled {
      color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
      cursor: default;

      :hover {
        background-color: unset !important;
      }
    }

    &__table {
      :deep(.mk-table-view__bottom),
      :deep(.v-divider) {
        display: none !important;
      }
    }

    :deep(.v-divider) {
      display: none !important;
    }
  }
</style>
