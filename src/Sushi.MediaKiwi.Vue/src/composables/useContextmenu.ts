import type { MkTableContextMenuSlotProps } from "@/models/table/TableProps";
import { computed, ref } from "vue";

export function useContextmenu<T>() {
  const contextmenuIsVisible = ref<boolean>(false);
  const contextMenuPosition = ref<[x: number, y: number]>();
  const contextDataItem = ref<T | undefined>();
  const contextmenuIsBulk = ref<boolean>(false);

  /**
   * Open the context menu
   * @param event
   * @param dataItem
   */
  function openContextMenu(
    event: MouseEvent,
    dataItem: T,
    options: {
      isBulkAction: boolean;
    }
  ) {
    event.preventDefault();

    // Set the position of the context menu
    contextMenuPosition.value = [event.clientX, event.clientY];

    // Set the data item
    contextDataItem.value = dataItem;

    // Show the context menu
    contextmenuIsVisible.value = true;

    // Set if the context menu is for bulk actions
    contextmenuIsBulk.value = options.isBulkAction;
  }

  /**
   * Context menu props for the context menu component
   */
  const contextMenuProps = computed<MkTableContextMenuSlotProps<T>>(() => {
    return {
      dataItem: contextDataItem.value!,
      isBulkAction: contextmenuIsBulk.value,
    };
  });

  /**
   * Context menu position props for the context menu component
   */
  const contextMenuPositionProps = computed(() => {
    return {
      modelValue: contextmenuIsVisible.value,
      target: contextMenuPosition.value,
      "onUpdate:modelValue": (value: boolean) => {
        contextmenuIsVisible.value = value;
      },
    };
  });

  return {
    openContextMenu,
    contextmenuIsVisible,
    contextMenuProps,
    contextMenuPosition,
    contextMenuPositionProps,
  };
}